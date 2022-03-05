import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { deleteOrder } from '../action/orderActions';
import { listOrders } from '../action/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';

export default function OrderListScreen(props) {
  
  const { pageNumber = 1,num= 'all', } = useParams();
  
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders, page, pages } = orderList;

  const orderDelete=useSelector((state)=>state.orderDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = orderDelete;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({type:ORDER_DELETE_RESET});
    dispatch(listOrders({pageNumber,numOrder: num !== 'all' ? num : '' ,}));
  }, [dispatch, num, pageNumber, successDelete]);
  const deleteHandler = (order) => {
    if (window.confirm('Are you sure to delete?')) {
      dispatch(deleteOrder(order._id));
    }
  };
  const [numOrder, setNumOrder] = useState(num!=='all'?num:'');
const submitHandler = (e) => {
  e.preventDefault();
  props.history.push(`/orderlist/num/${numOrder}`);
};

  return (
    <div>

     <div className="row">
     <h1>Commandes</h1>
      <form className="search" onSubmit={submitHandler}>
                  <div className="row">
                    <input
                      type="text"
                      name="q"
                      value={numOrder}
                      id="q"
                      placeholder="recherche une Commande"
                      onChange={(e) => setNumOrder(e.target.value)}
                    ></input>
                    <button className="primary" type="submit">
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                </form>
     </div>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
        <table className="table">
          <thead>
            <tr>
            <th>ID</th>
               <th>UTILISATEUR</th>
               <th>DATE</th>
               <th>TOTAL</th>
               <th>PAYÉ</th>
               <th>LIVRÉ</th>
               <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'Non'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'Non'}
                </td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() => {
                      props.history.push(`/order/${order._id}`);
                    }}
                  >
                   Détails
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(order)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="row center pagination">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? 'active' : ''}
                key={x + 1}
                to={`/orderlist/pageNumber/${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
            </div>
      </>
      )}
    </div>
  );
}