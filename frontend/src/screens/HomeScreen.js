import React, { useEffect } from 'react';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../action/productAction';
import { useParams,Link } from 'react-router-dom';
export default function HomeScreen() {
  const { pageNumber = 1}=useParams();
  const dispatch=useDispatch();
  const productList= useSelector((state)=>state.productList);
  const {loading,products,error,pages,page}=productList;
  useEffect(() => {
  dispatch(listProducts({pageNumber}))
  }, [dispatch, pageNumber])

  return (
    <div>
      {loading ? <LoadingBox /> 
      :error ? <MessageBox variant="danger">{error}</MessageBox> 
       : <div className="row center">
       {
         products.map(p=>(
        <Product key={p._id} product={p} />
         ))
       } 
       
     </div> }
          <div className="row center pagination">
          <Link  to={`/pageNumber/${page <= 1 ? 1: page-1 }`} 
                  >{'<<'} </Link>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? 'active' : ''}
                key={x + 1}
                to={`/pageNumber/${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
             <Link  to={`/pageNumber/${page === pages ? pages: page+1  }`} 
                  >{'>>'} </Link>
          </div>
      </div>
    )
}
