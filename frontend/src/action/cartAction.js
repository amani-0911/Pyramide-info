import axios from "axios"
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_METHOD, CART_SAVE_SHAPPING_ADDRESS } from "../constants/CartConstant";

export const addtoCart=(productId,qty)=>async(dispatch,getState)=>{
const {data}=await axios.get(`/api/products/${productId}`);

dispatch({
    type:CART_ADD_ITEM,
    payload:{
        name:data.name,
        image:data.image,
        price:data.price,
        countInStock:data.countInStock,
        product:data._id,
        qty,
    }
});
localStorage.setItem('cartItems',JSON.stringify(getState().cart.cartItems));

}

export const removeFromCart=(productId)=>async (dispatch,getState)=>{
dispatch({
    type:CART_REMOVE_ITEM,
    payload:productId
});
localStorage.setItem('cartItems',JSON.stringify(getState().cart.cartItems));

}
//action speak only to the store
export const saveShippingAddress=(data)=> (dispatch)=>{
   dispatch({type:CART_SAVE_SHAPPING_ADDRESS,payload:data});
   localStorage.setItem('shippingAddress',JSON.stringify(data));

}

export const savePaymentMethod=(data)=>(dispatch)=>{
    dispatch({type:CART_SAVE_PAYMENT_METHOD,payload:data})
}