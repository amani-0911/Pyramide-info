import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addtoCart, removeFromCart } from '../action/cartAction';
import MessageBox from '../components/MessageBox';
import { Link } from 'react-router-dom';
export default function CartScreen(props) {
   const productId=props.match.params.id;
   //props.location.search return tous qui vient apres ?
   const qty=props.location.search ? Number(props.location.search.split('=')[1]) : 1;
   {/*props.location.search return value after ? ex: product?qty=12=>va return qyu=12 */}
    const cart =useSelector(state=>state.cart);
    const {cartItems}=cart;
   const dispatch = useDispatch();
  useEffect(()=>{
      if(productId){
      dispatch(addtoCart(productId,qty))
      }
  },[dispatch, productId, qty])
  const removeFromcartHandler=(id)=>{
      //delete action
      dispatch(removeFromCart(id));
  }
  const checkoutHandler=()=>{
      props.history.push('/signin?redirect=shipping')
  }
   return (
       <div className="row top">
          <div className="col-2">
            <h1>Votre Panier</h1>
              {cartItems.length === 0 ?<MessageBox>
                Votre panier est vide <Link to="/">Continuer mes achats</Link>
              </MessageBox> :(
                  <ul>
                      {cartItems.map((item)=>(
                       <li key={item.product}>
                                <div className="row">
                                    <div>
                                        <img src={item.image} alt={item.name}  className="small"/>
                                    </div>
                                    <div className="min-30">
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </div>
                                    <div>
                                        <select value={item.qty} onChange={e=>dispatch(addtoCart(item.product,Number(e.target.value)))}>
                                        {
                                        [...Array(item.countInStock).keys()].map(x=>(
                                            <option key={x+1} value={x+1}>{x+1}</option>
                                        ))
                                    }
                                        </select>
                                    </div>
                                    <div>
                                      {item.price}MAD 
                                    </div>
                                  <div>
                                    <button type="button" onClick={()=>removeFromcartHandler(item.product)}>Supprimer</button>
                                 </div>
                                </div>
                       </li>   
                      ))}
                  </ul>
              )}
            </div> 
            <div className="col-1">
                <div className="card card-body">
                    <ul>
                        <li>
                            <h2>Sous-total ({cartItems.reduce((a,c)=>a+c.qty,0)} produits): {cartItems.reduce((a,c)=>a+c.price*c.qty,0)}MAD</h2>
                        </li>
                        <li>
                            <button className="primary block" type="button" onClick={checkoutHandler} disabled={cartItems.length===0}>
                            Passer à la livraison
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
       </div>
    )
}
