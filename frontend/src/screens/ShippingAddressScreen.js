import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../action/cartAction';
import CheckoutSteps from '../components/CheckoutSteps'

export default function ShippingAddressScreen(props) {
  const userSignin=useSelector(state=>state.userSignin);
  const cart=useSelector(state=>state.cart);
  const {shippingAddress}=cart;
   const {userInfo}=userSignin;
   if(!userInfo){
       props.history.push('/signin?redirect=shipping')
   }

  const [fullName,setFullName]=useState(shippingAddress.fullName);
    const [address,setAddress]=useState(shippingAddress.address);
    const [city,setCity]=useState(shippingAddress.city);
    const [postalCode,setPostalCode]=useState(shippingAddress.postalCode);
    const [country,setCountry]=useState(shippingAddress.country);
     const dispatch = useDispatch();
    const submitHandler=(e)=>{
        e.preventDefault();
        dispatch(saveShippingAddress({fullName,address,city,postalCode,country}));
             props.history.push('/payment');
    }
    return (
        <div>
            <CheckoutSteps step1 step2></CheckoutSteps>
          <form className="form" onSubmit={submitHandler}>
              <div>
                  <h1>Adresse de livraison</h1>
              </div>
              <div>
                  <label htmlFor="fullName">Nom et prénom</label>
                  <input type="text" id="fullName" placeholder="Entrer Votre Nom et prénom" value={fullName} required onChange={(e)=>setFullName(e.target.value)}/>
              </div>
              <div>
                  <label htmlFor="address">Adresse</label>
                  <input type="text" id="address" placeholder="Entrer Votre Adresse" value={address} required onChange={(e)=>setAddress(e.target.value)}/>
              </div>
              <div>
                  <label htmlFor="city">Ville</label>
                  <input type="text" id="city" placeholder="Entrer Votre Ville" value={city} required onChange={(e)=>setCity(e.target.value)}/>
              </div>
              <div>
                  <label htmlFor="postalCode">code postal</label>
                  <input type="text" id="postalCode" placeholder="Entrer Votre code postal" value={postalCode} required onChange={(e)=>setPostalCode(e.target.value)}/>
              </div>  
              <div>
                  <label htmlFor="country">pays</label>
                  <input type="text" id="country" placeholder="Entrer Votre pays" value={country} required onChange={(e)=>setCountry(e.target.value)}/>
              </div>
              <div>
                  <label/>
                  <button className="primary" type="submit">Continuer</button>
              </div>
          </form>
        </div>
    )
}
