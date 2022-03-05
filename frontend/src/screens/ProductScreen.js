import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ReactHtmlParser from "react-html-parser";
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Link } from 'react-router-dom';
import Rating from '../components/Rating'
import { createReview, detailsProduct } from '../action/productAction';
import { PRODUCT_REVIEW_CREATE_RESET } from '../constants/productConstants';
export default function ProductScreen(props) {

    //useSelector getting details from react store
const productDetails=useSelector(state=>state.productDetails)
const {loading,error,product}=productDetails  ;
const dispatch=useDispatch();
const productId=props.match.params.id;
const [qty, setQty] = useState(1);
const userSignin = useSelector((state) => state.userSignin);
const { userInfo } = userSignin;

const productReviewCreate = useSelector((state) => state.productReviewCreate);
const {
  loading: loadingReviewCreate,
  error: errorReviewCreate,
  success: successReviewCreate,
} = productReviewCreate;

const [rating, setRating] = useState(0);
const [comment, setComment] = useState('');

useEffect(()=>{
    if (successReviewCreate) {
        window.alert('Review Submitted Successfully');
        setRating('');
        setComment('');
        dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
      }
    dispatch(detailsProduct(productId))
},[productId, dispatch, successReviewCreate]);
const addToCartHandler=()=>{
    //history change url 
    props.history.push(`/cart/${productId}?qty=${qty}`);
}
const submitHandler = (e) => {
    e.preventDefault();
    if (comment && rating) {
      dispatch(
        createReview(productId, { rating, comment, name: userInfo.name })
      );
    } else {
      alert('Please enter comment and rating');
    }
  };
    return (
        <div>
      {loading ? <LoadingBox /> 
      :error ? <MessageBox variant="danger">{error}</MessageBox> 
       :  <div>
       <Link to="/"><i class="fas fa-chevron-left"></i>{' '}Continuer mes achats</Link>
     <div className="row top">
        
         <div className="col-2">
         <div className="topProductScreen">
            <ul>
                 <li>
                     <h1>{product.name}</h1>
                 </li>
                 <li>
                     <Rating rating={product.rating} numReviews={product.numReviews} />
                 </li>

             </ul>  
             
        <img className="large" src={product.image} alt={product.name} />
        </div>   
         </div>
         <div className="col-11">
           </div>
         <div className="col-1">
              <div className="card card-body">
                  <ul>
                      <li>
                          <div className="row">
                              <div>Prix</div>
                              <div className="price">{product.price}MAD</div>
                          </div>
                      </li>
                      <li>
                          <div className="row">
                              <div>Statut</div>
                              <div>{product.countInStock > 0 ?
                                   <span className="success">En stock</span>
                               :<span className="error">Indisponible</span>}</div>
                          </div>
                      </li>
                      {product.countInStock > 0 &&(
                          <>
                          <li>
                              <div className="row">
                                  <div>Quantité</div>
                                  <div>
                                <select value={qty} onChange={e=>setQty(e.target.value)} >
                                   
                                   {/* [...Array(product.countInStock).keys()] return si countInstock=5 return [0,1,2,3,4]*/}
                                    {
                                        [...Array(product.countInStock).keys()].map(x=>(
                                            <option key={x+1} value={x+1}>{x+1}</option>
                                        ))
                                    }
                                </select>
                                </div>
                              </div>
                          </li>
                          <li>
                          <button onClick={addToCartHandler} className="primary block">Ajouter au panier</button>
                       </li>
                       </>
                      )}
                  </ul>
              </div>
         
         </div>
     </div>
     <div className="descriptionProduct">
       <div className="descriptionProductWrapper">
         <h2> Description:</h2>
             <p className="description">{ReactHtmlParser(product.description)}</p>
          </div>
        </div>
     <div className="reviewsProduct">
            <h2 id="reviews">Avis</h2>
            {product.reviews.length === 0 && (
              <MessageBox>Il n'y a pas d'avis</MessageBox>
            )}
            <ul>
              {product.reviews.map((review) => (
                <li className="reviewItem" key={review._id}>
                <div className="reviewItemTop">
                  <strong>{review.name}</strong>
                   <p className="reviewItemTopDate">{review.createdAt.substring(0, 10)}</p>
                   </div>
                  <Rating rating={review.rating} caption=" "></Rating>
                  <p>{review.comment}</p>
                </li>
              ))}
              <li>
                {userInfo ? (
                  <form className="form" onSubmit={submitHandler}>
                    <div>
                      <h2>Écrire un avis client</h2>
                    </div>
                    <div>
                      <label htmlFor="rating">Note</label>
                      <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                   <option value="">Sélectionner...</option>
                         <option value="1">1- Mauvais</option>
                         <option value="2">2- Juste</option>
                         <option value="3">3- Bien</option>
                         <option value="4">4- Très bien</option>
                         <option value="5">5- Excellent</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="comment">Commentaire</label>
                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>
                    <div>
                      <label />
                      <button className="primary" type="submit">
                      Soumettre
                      </button>
                    </div>
                    <div>
                      {loadingReviewCreate && <LoadingBox></LoadingBox>}
                      {errorReviewCreate && (
                        <MessageBox variant="danger">
                          {errorReviewCreate}
                        </MessageBox>
                      )}
                    </div>
                  </form>
                ) : (
                  <MessageBox>
                    S'il vous plaît<Link to="/signin">Connectez-vous</Link> pour rédiger un avis
                  </MessageBox>
                )}
              </li>
            </ul>
          </div>
   </div> }
         
      </div>
      
    )
}
