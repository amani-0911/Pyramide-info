import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { createOrder } from '../action/orderActions';
import CheckoutSteps from '../components/CheckoutSteps'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';

export default function PlaceOrderScreen(props) {
  const cart=useSelector((state)=>state.cart);
  if(!cart.paymentMethod){
      props.history.push('/payment')
  }
  const orderCreate =useSelector((state)=>state.orderCreate);
  const {loading,success,error,order}=orderCreate;
  const toPrice =(num)=>Number(num.toFixed(2)); //5.12=>"5.12"=>5.12
cart.itemsPrice =toPrice(cart.cartItems.reduce((a,c)=>a+c.qty * c.price,0));
cart.shippingPrice=cart.itemsPrice > 300 ? toPrice(0) : toPrice(15);
cart.taxPrice=cart.itemsPrice < 200 ? toPrice(0): toPrice(0.15 * cart.itemsPrice);
cart.totalPrice=cart.itemsPrice +cart.shippingPrice+cart.taxPrice;
const dispatch=useDispatch();
const placeholderHandler=()=>{
   dispatch(createOrder({...cart,orderItems:cart.cartItems} ))
}
useEffect(()=>{
if(success){
    props.history.push(`/order/${order._id}`);
    dispatch({type:ORDER_CREATE_RESET});
}
},[dispatch, order, props.history, success]);
return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />
            <div className="row top">
                <div className="col-2">
                   <ul>
                       <li>
                           <div className="card card-body">
                               <h2>Livraison</h2>
                               <p>
                                   <strong>Nom: </strong>{cart.shippingAddress.fullName} <br />
                                   <strong>Adresse: </strong>{cart.shippingAddress.address},
                                   {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                                   {cart.shippingAddress.country}
      
                               </p>
                           </div>
                       </li>
                       <li>
                           <div className="card card-body">
                               <h2>Paiement</h2>
                               <p>
                                   <strong>Mode: </strong>{cart.paymentMethod} 
                               </p>
                           </div>
                       </li>
                       <li>
                           <div className="card card-body">
                               <h2>Votre commande</h2>
                               <ul>
                      {cart.cartItems.map((item)=>(
                       <li key={item.product}>
                                <div className="row">
                                    <div>
                                        <img src={item.image} alt={item.name}  className="small"/>
                                    </div>
                                    <div className="min-30">
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </div>
                                   
                                    <div>
                                        {item.qty} x {item.price}MAD={item.qty * item.price}MAD  
                                    </div>
                                </div>
                       </li>   
                      ))}
                  </ul>
                           </div>
                       </li>
                   </ul>
                </div>
                <div className="col-1">
                          <div className="card card-body">
                              <ul>
                                  <li><h2>Récapitulatif de commande</h2></li>
                                 <li>
                                     <div className="row">
                                         <div>Articles</div>
                                         <div>{cart.itemsPrice.toFixed(2)}MAD</div>
                                     </div>
                                 </li>
                                 <li>
                                     <div className="row">
                                         <div>Livraison</div>
                                         <div>{cart.shippingPrice.toFixed(2)}MAD</div>
                                     </div>
                                 </li>
                                 <li>
                                     <div className="row">
                                         <div>Dont Taxes</div>
                                         <div>{cart.taxPrice.toFixed(2)}MAD</div>
                                     </div>
                                 </li>
                                 <li>
                                     <div className="row">
                                         <div><strong>TOTAL TTC À PAYER</strong></div>
                                         <div><strong>{cart.totalPrice.toFixed(2)}MAD</strong></div>
                                     </div>
                                 </li>
                                 <li>
                                     <button type="button" onClick={placeholderHandler} 
                                     disabled={cart.cartItems.length === 0}
                                     className="primary block">
                                         Commander et Payer
                                     </button>
                                 </li>
                                 {
                                     loading && <LoadingBox />
                                 }
                                 {
                                     error && <MessageBox variant="danger">{error}</MessageBox>
                                 }
                              </ul>
                          </div>
                </div>
            </div>
        </div>
    )
}
