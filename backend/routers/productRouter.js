import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import { isAdmin, isAuth } from '../utils.js';
const productRouter=express.Router();
productRouter.get('/',expressAsyncHandler(async (req,res)=>{
   const pageSize =3;
   const page=Number(req.query.pageNumber) || 1;
    const name = req.query.name || '';
    const brand = req.query.brand || '';
    const nameFilter=name ? {name: { $regex: name, $options: 'i'}}: {};
    const order = req.query.order || '';
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;
        const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
        const ratingFilter = rating ? { rating: { $gte: rating } } : {};
        const sortOrder =
          order === 'lowest'
            ? { price: 1 }
            : order === 'highest'
            ? { price: -1 }
            : order === 'toprated'
            ? { rating: -1 }
            : { _id: -1 };
    const category = req.query.category || '';
    const categoryFilter = category ? { category } : {};
    const brandFilter=brand ?{brand}:{};
    const count = await Product.count({
      ...nameFilter,
      ...categoryFilter,
      ...brandFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    const products=await Product.find({...nameFilter, ...categoryFilter,...brandFilter,...priceFilter,
      ...ratingFilter})
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.send({products,page,pages:Math.ceil(count/pageSize)});
})) 
productRouter.get(
    '/categories',
    expressAsyncHandler(async (req, res) => {
      const categories = await Product.find().distinct('category');
      res.send(categories);
    })
  );
  productRouter.get(
    '/brands',
    expressAsyncHandler(async (req, res) => {
      const name = req.query.name || '';
      const category = req.query.category || '';
      const nameFilter=name ? {name: { $regex: name, $options: 'i'}}: {};
      const categoryFilter = category ? { category } : {};
      const brands = await Product.find({...nameFilter,...categoryFilter}).distinct('brand');
      res.send(brands);
    })
  );
productRouter.get('/seed',expressAsyncHandler(async(req,res)=>{
    const createProducts=await Product.insertMany(data.products);
    res.send({createProducts});
}))

productRouter.get('/:id',expressAsyncHandler(async (req,res)=>{
    const product =await Product.findById(req.params.id);
   if(product){
       res.send(product)
   }else{
       res.status(404).send({message:'Product Not Found'})
   }
}))
productRouter.post(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        image:req.body.image,
        brand: req.body.brand,
        category: req.body.category,
        countInStock: req.body.countInStock,
        description:req.body.description,
        rating:0,
        numReviews:0
      });
      const createdProduct = await product.save();
      res.send({ message: 'Product Created', product: createdProduct });
    })
  );
productRouter.put('/:id',
isAuth,
isAdmin,expressAsyncHandler(async(req,res)=>{
    const productId=req.params.id;
  
    const product =await Product.findById(productId);
 if(product){
    product.name= req.body.name;
    product.price=req.body.price;
    product.image=req.body.image;
    product.brand= req.body.brand;
    product.category= req.body.category;
    product.countInStock= req.body.countInStock;
    product.description=req.body.description
  const updatedProduct=await product.save();
   if(updatedProduct){
       res.status(200).send({message:' Product Updeted',data:updatedProduct});
   }
}else{
    res.status(404).send({message:'Error in updete Product'})  
   } 
}))
productRouter.delete("/:id",isAuth,
isAdmin,expressAsyncHandler(async(req,res)=>{
    const deletedProduct=await Product.findById(req.params.id);
    if(deletedProduct){
        await deletedProduct.remove();
        res.send({message:"Product Deleted",product: deletedProduct});
    }else{
    res.status(404).send({message:"Error in Deletion."})
    }
}))
productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

export default productRouter;