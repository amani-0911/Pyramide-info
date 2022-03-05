import axios from 'axios';
import {PayPalButton} from 'react-paypal-button-v2';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { deliverOrder, detailsOrder, payOrder } from '../action/orderActions';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants';

export default function OrderScreen(props) {
 
 const orderId=props.match.params.id;
 const [sdkReady,setSdkReady]=useState(false);
 const orderDetails=useSelector((state)=>state.orderDetails);
 const {loading,order,error}=orderDetails;
 const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

const orderPay=useSelector(state=>state.orderPay);
const {loading:loadingPay,error:errorPay,success:successPay}=orderPay;
const orderDeliver=useSelector(state=>state.orderDeliver);
const {loading:loadingDeliver,error:errorDeliver,success:successDeliver}=orderDeliver;


const dispatch=useDispatch();


useEffect(()=>{
    const addPayPalScript=async ()=>{
        const {data}=await axios.get('/api/config/paypal');
        const script=document.createElement('script');
        script.type="text/javascript";
        script.src=`https://www.paypal.com/sdk/js?client-id=${data}`;
        script.async=true;
        script.onload= ()=>{
         setSdkReady(true);
     };
     document.body.appendChild(script);
    };
   if(!order || successPay ||   successDeliver ||(order && order._id!==orderId)){
    dispatch({type:ORDER_PAY_RESET}) ;
    dispatch({ type: ORDER_DELIVER_RESET });
    dispatch(detailsOrder(orderId));
   }else{
    if(!order.isPaid){
        if(!window.paypal){
            addPayPalScript();
        }else{
            setSdkReady(true);
        }
     }
   }

},[dispatch, order, orderId, sdkReady, successPay,successDeliver]);
const successPaymentHandler =(paymentResult)=>{
    dispatch(payOrder(order,paymentResult))
}
const deliverHandler = () => {
    dispatch(deliverOrder(order._id));
  };
return loading ? (<LoadingBox />):
error ? (<MessageBox variant="danger">{error}</MessageBox>):(
        <div>
            <h1>Commande: {order._id}</h1>
            <div className="row top">
                <div className="col-2">
                   <ul>
                       <li>
                           <div className="card card-body">
                               <h2>Livraison</h2>
                               <p>
                                   <strong>Nom: </strong>{order.shippingAddress.fullName} <br />
                                   <strong>Adresse: </strong>{order.shippingAddress.address},
                                   {order.shippingAddress.city}, {order.shippingAddress.postalCode},
                                   {order.shippingAddress.country}
      
                               </p>
                               {order.isDelivered? <MessageBox variant="success">Livré à{order.deliveredAt}</MessageBox>:
                               <MessageBox variant="danger">Non livrés</MessageBox>}
                           </div>
                       </li>
                       <li>
                           <div className="card card-body">
                               <h2>Paiement</h2>
                               <p>
                                   <strong>Mode: </strong>{order.paymentMethod} 
                               </p>
                               {order.isPaid? <MessageBox variant="success"> Payé à {order.paidAt}</MessageBox>:
                               <MessageBox variant="danger">Non payé</MessageBox>}
                      
                           </div>
                       </li>
                       <li>
                           <div className="card card-body">
                               <h2>Votre commande</h2>
                               <ul>
                      {order.orderItems.map((item)=>(
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
                                         <div>{order.itemsPrice.toFixed(2)}MAD</div>
                                     </div>
                                 </li>
                                 <li>
                                     <div className="row">
                                         <div>Livraison</div>
                                         <div>{order.shippingPrice.toFixed(2)}MAD</div>
                                     </div>
                                 </li>
                                 <li>
                                     <div className="row">
                                         <div>Dont Taxes</div>
                                         <div>{order.taxPrice.toFixed(2)}MAD</div>
                                     </div>
                                 </li>
                                 <li>
                                     <div className="row">
                                         <div><strong>TOTAL TTC À PAYER</strong></div>
                                         <div><strong>{order.totalPrice.toFixed(2)}MAD</strong></div>
                                     </div>
                                 </li>
                                 {
                                  !order.isPaid && (
                                      <li>
                                          {!sdkReady ? (<LoadingBox />):
                                          (
                                               <>
                                               {errorPay && (<MessageBox variant="danger">{errorPay}</MessageBox>) }
                                               {loadingPay && (<LoadingBox></LoadingBox>)}
                                              <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler}></PayPalButton>
                                               </>
                                          )}
                                      </li>
                                  )   
                                 }
                                 {userInfo.isAdmin && order.isPaid && !order.isDelivered &&(
                                     <li>
                                         {loadingDeliver && <LoadingBox></LoadingBox>}
                                         {errorDeliver && (<MessageBox variant="danger">{errorDeliver}</MessageBox>)}
                                         <button type="button" onClick={deliverHandler} className="primary block">Livrer la Commande</button>
                                     </li>
                                 )}
                              </ul>
                          </div>
                </div>
            </div>
        </div>
    )
}
