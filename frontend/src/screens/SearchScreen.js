import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams ,Link} from 'react-router-dom';

import { listProductBrands, listProducts } from '../action/productAction';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import Rating from '../components/Rating';
import { prices, ratings } from '../utils';

export default function SearchScreen(props) {
  const {
    name = 'all',
    category = 'all',
    min = 0,
    max = 0,
    rating = 0,
    order = 'newest',
    pageNumber=1,
    brand='all',
  } = useParams();
  const dispatch = useDispatch();
  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;
  const pructBrandList=useSelector((state)=>state.pructBrandList);
  const {
    loading: loadingBrands,
    error: errorBrands,
    brands,
  } = pructBrandList;
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages  } = productList;
  useEffect(() => {
    dispatch(listProducts({ pageNumber,name: name !== 'all' ? name : '' ,
    category: category !== 'all' ? category : '',brand:brand !== 'all' ? brand : '',  min,
    max,
    rating,
    order}));
    dispatch(listProductBrands({name: name !== 'all' ? name : '',category: category !== 'all' ? category : ''}))
  }, [category, dispatch, max, min, name, order,brand, pageNumber, rating]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || pageNumber;
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    const filterRating = filter.rating || rating;
    const filterBrand=filter.brand || brand;
    const sortOrder = filter.order || order;
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
    return `/search/category/${filterCategory}/name/${filterName}/brand/${filterBrand}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}/pageNumber/${filterPage}`;
  };

  return (
    <div>
      <div className="row">
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div>{products.length} Results</div>
        )}
         <div>
         Trier par{' '}
          <select
            value={order}
            onChange={(e) => {
              props.history.push(getFilterUrl({ order: e.target.value }));
            }}
          >
            <option value="newest">Pertinence</option>
            <option value="lowest">Prix croissant</option>
            <option value="highest">prix décroissant</option>
            <option value="toprated">Moy. Avis des clients</option>
          </select>
        </div>
      </div>
      <div className="row top ">
        <div className="col-1 sidebar">
          <h3>Categories</h3>
          <div >
            {loadingCategories ? (
              <LoadingBox></LoadingBox>
            ) : errorCategories ? (
              <MessageBox variant="danger">{errorCategories}</MessageBox>
            ) : (
              <ul className="sidebarList">
                <li className="sidebarListItem">

                  <Link
                    className={'all' === category ? 'active' : ''}
                    to={getFilterUrl({ category: 'all' })}
                  >
                    tout
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c} className="sidebarListItem">
                 {c === category ? (<i class="fas fa-check-square"></i>):(<i class="fa fa-stop" ></i>) }
                    <Link
                      className={c === category ? 'active' : ''}
                      to={getFilterUrl({ category: c })}
                    > 
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
          <hr className="sidebarHr" />
            <h3>Prix(MAD)</h3>
            <ul className="sidebarList">
              {prices.map((p) => (
                <li key={p} className="sidebarListItem">
                  <Link
                   to={getFilterUrl({ min: p.min, max: p.max })}
                   className={
                     `${p.min}-${p.max}` === `${min}-${max}` ? 'active' : ''
                   }
                 >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
            </div>
          <div>
          <hr className="sidebarHr" />
            <h3>Moy. Avis des clients</h3>
            <ul className="sidebarList">
              {ratings.map((r) => (
                <li key={r.name} className="sidebarListItem">
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? 'active' : ''}
                  >
                    <Rating caption={' et plus'} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <hr className="sidebarHr" />
          <h3>Marques</h3>
          <div >
            {loadingBrands ? (
              <LoadingBox></LoadingBox>
            ) : errorBrands ? (
              <MessageBox variant="danger">{errorBrands}</MessageBox>
            ) : (
              <ul className="sidebarList">
                {brands.map((b) => (
                  <li key={b} className="sidebarListItem">
                 {b === brand ? (<i class="fas fa-check-square"></i>):(<i class="fa fa-stop" ></i>) }
                    <Link
                      className={b === brand ? 'active' : ''}
                      to={getFilterUrl({ brand: b })}
                    > 
                      {b}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="col-3">
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}
              <div className="row center">
                {products.map((product) => (
                  <Product key={product._id} product={product}></Product>
                ))}
              </div>
              <div className="row center pagination">
              <Link  to={getFilterUrl({ page: page <= 1 ? 1: page-1 })}
                  >{'<<'} </Link>
                {[...Array(pages).keys()].map((x) => (
                  <Link
                    className={x + 1 === page ? 'active' : ''}
                    key={x + 1}
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    {x + 1}
                  </Link>
                ))}
                 <Link  to={getFilterUrl({ page: page === pages ? pages: page+1 })}
                  >{'>>'} </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}