import React from 'react'
import Rating from './Rating';
import { Link } from 'react-router-dom';

function Product(props) {
    const {product}=props;
    return (
        <div  className="card">
              <Link to={`/product/${product._id}`}>
                  <img className="meduim" src={product.image} alt={product.name} />
              </Link>
              <div className="card-body">
                  <Link to={`/product/${product._id}`}>
                      <h2 className="ProductName">{product.name}</h2>
                  </Link>
                 <Rating rating={product.rating} numReviews={product.numReviews}/>
                  <div className="price">
                    {product.price}MAD
                  </div>
              </div>
          </div>
    )
}

export default Product;
