import express from 'express';

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import userRouter from './routers/userRouter.js';
import productRouter from './routers/productRouter.js';
import ordreRouter from './routers/orderRouter.js';
import uploadRouter from './routers/uploadRouter.js';
dotenv.config();

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
mongoose.connect(process.env.DB_URL || 'mongodb://localhost/pyramide',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

app.use('/api/uploads',uploadRouter)
app.use('/api/users',userRouter);
app.use('/api/products',productRouter);
app.use('/api/orders',ordreRouter);
app.get('/api/config/paypal',(req,res)=>{
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
})
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.get('/',(req,res)=>{
    res.send('server run..')
});
//is an error cacher
app.use((err,req,res,next)=>{
  res.status(500).send({messagr:err.message})
})
const port =process.env.PORT || 5000;
app.listen(port, ()=>{
   console.log('server running ')
})