import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../action/cartAction';
import CheckoutSteps from '../components/CheckoutSteps'

export default function PaymentMethodeScreen(props) {
  const cart =useSelector((state)=>state.cart);
  const {shippingAddress}=cart;
  const [paymentMethod,setPaymentMethod]=useState('PayPal');
 if(!shippingAddress.address){
         props.history.push('/shipping');
     } 
const dispatch=useDispatch();
 const submitHandler=(e)=>{
     e.preventDefault();
     dispatch(savePaymentMethod(paymentMethod));
     props.history.push('/placeorder')
 }
    return (
        <div>
            <CheckoutSteps step1 step2 step3></CheckoutSteps>
            <form onSubmit={submitHandler} className="form">
                <div>
                    <h1>Mode de Paiement</h1>
                </div>
                <div>
                    <div className="paymentMethode" >
                        <input type="radio" id="paypal" value="PayPal" name="paymentMethod" required checked onChange={(e) =>setPaymentMethod(e.target.value)} />
                      <label htmlFor="paypal" ><img className="paypalImg" src="/paypal.jpg" alt="paypal" /> <span className="paymentMethodeText">PayPal</span></label>
                       </div>
                       
                       <div className="paymentMethode" >
                       <input type="radio" id="stripe" value="Stripe" name="paymentMethod" required  onChange={(e) =>setPaymentMethod(e.target.value)} />
                      <label htmlFor="stripe"><img className="visaImg" src="/visa.jpg" alt="visa" /> <img className="visaImg" src="/mastercard.jpg" alt="mastercard" /> <span className="paymentMethodeText">Paiement par CB</span></label>
                   
                       </div>
                </div>
                <div>
                    <button className="primary" type="submit">Continuer</button>
                </div>
            </form>
        </div>
    )
}
