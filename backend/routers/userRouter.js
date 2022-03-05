import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import User from '../models/userModel.js';
import { generateToken, isAdmin, isAuth, mailgun } from '../utils.js';

const userRouter=express.Router();
userRouter.get('/seed',expressAsyncHandler(async (req,res)=>{
  const createUsers= await User.insertMany(data.users);
  res.send({createUsers});
})); 
userRouter.post('/signin',expressAsyncHandler(async(req,res)=>{
     const user=await User.findOne({email:req.body.email});
     if(user){
       if(bcrypt.compareSync(req.body.password,user.password)){
         res.send({
          _id: user._id,  
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          //generate Token by jsonwebtoken
          token: generateToken(user),
         });
         return;
       }
     }
     res.status(401).send({message: 'Invalid email or password'});
}))
userRouter.post('/register',expressAsyncHandler(async(req,res)=>{
  const user=new  User({name:req.body.name,email:req.body.email
    ,password:bcrypt.hashSync(req.body.password,8)});
 
const createdUser=await user.save();
res.send({
  _id: createdUser._id,  
  name: createdUser.name,
  email: createdUser.email,
  isAdmin: createdUser.isAdmin,
  //generate Token by jsonwebtoken
  token: generateToken(createdUser),
 });
}))
userRouter.get('/:id',expressAsyncHandler(async(req,res)=>{
  const user=await User.findById(req.params.id);
  if(user){
    res.send(user);
  }else{
    res.status(404).send({message:'user not Found'});
  }

}))
userRouter.put('/profile',
isAuth,
expressAsyncHandler(async(req,res)=>{
const user =await User.findById(req.user._id);
if(user){
  user.name=req.body.name || user.name;
  user.email=req.body.email || user.email;
  if(req.body.password){
  user.password=bcrypt.hashSync(req.body.password,8) ;
  }
  const updatedUser=await user.save();
  res.send({
    _id: updatedUser._id,  
  name: updatedUser.name,
  email: updatedUser.email,
  isAdmin: updatedUser.isAdmin,
  //generate Token by jsonwebtoken
  token: generateToken(updatedUser),
  });
}else{
  res.status(404).send({message:'user not Found'});
}
}))
userRouter.get('/',isAuth,isAdmin,
expressAsyncHandler(async(req,res)=>{
  const name=req.query.name;
  const nameFilter=name ? {name: { $regex: name, $options: 'i'}}: {};

  const users=await User.find({...nameFilter});
  res.send(users);

}))
userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id);
    if(user){
  if(user.email === 'admin@exemple.com'){
    res.status(400).send({message:'Can Not Delete Admin User'});
    return;
  }
  const deleteUser=await user.remove();
  res.send({message:'User Deleted',user: deleteUser});
    }else{
      res.status(404).send({message:'User Not Found'});
 
    }
  })
)
userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id);
    if(user){
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin =req.body.isAdmin === user.isAdmin ? user.isAdmin : req.body.isAdmin;
  
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
)

userRouter.put('/password/forgot',expressAsyncHandler(async(req,res)=>{
  const user=await User.findOne({email:req.body.email});
  if(user){
  const token=user.getResetPasswordToken();
  const updateUser= await user.save();
  const resetUrl=`${req.protocol}://${req.get('host')}/password/reset/${token}`
  mailgun()
  .messages()
  .send(
    {
      from: 'Amazona <amazona@mg.yourdomain.com>',
      to: `${user.name} <${user.email}>`,
      subject: `Reset Password `,
      html: `<h2>Please click on given link to rest  your password</h2>
      <a>${resetUrl}</a>`,
    },
    async(error, body) =>{
      if (error) {
        console.log(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
      } else {
        console.log(body);
      }
    }
  );
  res.send({message:'Token generated',user: updateUser});
  }else{
    res.status(404).send({message: ' email User Not Found'});
}
}))
userRouter.put('/password/reset/:token',expressAsyncHandler(async(req,res)=>{
  // Hash URL token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

  const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
  })
  if (user) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.password=bcrypt.hashSync(req.body.password,8) ;
  const updatedUser=await user.save();
  res.send({
    _id: updatedUser._id,  
  name: updatedUser.name,
  email: updatedUser.email,
  isAdmin: updatedUser.isAdmin,
  //generate Token by jsonwebtoken
  token: generateToken(updatedUser),
  });
    
   }else{
   res.status(401).send({message: 'Invalid token'});
   }

}))


export default userRouter; 