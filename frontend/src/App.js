import React, { useEffect, useState } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import ProductScreen from './screens/ProductScreen';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SigninScreen from './screens/SigninScreen';
import { signout } from './action/UserActions';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodeScreen from './screens/PaymentMethodeScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileSceen from './screens/ProfileSceen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UsersListScreen from './screens/UsersListScreen';
import UserEditScreen from './screens/UserEditScreen';
import SearchScreen from './screens/SearchScreen';
import SearchBox from './components/SearchBox';
import LoadingBox from './components/LoadingBox';
import MessageBox from './components/MessageBox';
import { listProductCategories } from './action/productAction';
import DashboardScreen from './screens/DashboardScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import NewPasswordSceen from './screens/NewPasswordSceen';

function App() {
 
  const cart =useSelector((state)=>state.cart);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const userSignin=useSelector((state)=>state.userSignin);
  const {cartItems}=cart;
  const {userInfo}=userSignin;
  const dispatch =useDispatch();
 const signoutHandler=()=>{
dispatch(signout());
 }
 const productCategoryList = useSelector((state) => state.productCategoryList);
 const {
   loading: loadingCategories,
   error: errorCategories,
   categories,
 } = productCategoryList;
 useEffect(() => {
   dispatch(listProductCategories());
 }, [dispatch]);
  return (
    <BrowserRouter >
<div className="grid-container"> 
        <header className="row">
        <div>
        <button
              type="button"
              className="open-sidebar"
              onClick={() => setSidebarIsOpen(true)}
            >
              <i className="fa fa-bars"></i>
            </button>
          <Link className="brand" to="/">pyramide</Link></div>
       
        <Route
              render={({ history }) => (
                <SearchBox history={history}></SearchBox>
              )}
            ></Route>
           
        <div>
            <Link to="/cart">Panier
            {cartItems.length >0 && (
              <span className="badge">{cartItems.length}</span>
            )}
            </Link>
            {
              userInfo ?(
                <div className="dropdown">
                <Link to="#">{userInfo.name}
                <i className="fa fa-caret-down"></i>{' '}
                </Link>
               <ul className="dropdown-contentt">
                <li>
                  <Link to="/profile" >Mon profil</Link>
                </li>
                <li>
                  <Link to="/orderhistory" >Mes commandes</Link>
                </li>
                 <li>
                 <Link to="#signout" onClick={signoutHandler}>Déconnection</Link>
               </li></ul>
                </div>
              ):(<Link to="/signin">Se Connecter</Link>)
            }
            {userInfo && userInfo.isAdmin &&(
              <div className="dropdown">
                <Link to="#admin">
                  Admin <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/productlist">Produits</Link>
                  </li>
                  <li>
                    <Link to="/orderlist">Commandes</Link>
                  </li>
                  <li>
                    <Link to="/userlist">Utilisateurs</Link>
                  </li>
                </ul>

              </div>
            )}
            
        </div>
        </header>
        <aside className={sidebarIsOpen ? 'open' : ''}>
          <ul className="categories">
            <li>
              <strong>Categories</strong>
              <button
                onClick={() => setSidebarIsOpen(false)}
                className="close-sidebar"
                type="button"
              >
               <i class="fas fa-times"></i>
              </button>
            </li>
            {loadingCategories ? (
              <LoadingBox></LoadingBox>
            ) : errorCategories ? (
              <MessageBox variant="danger">{errorCategories}</MessageBox>
            ) : (
              categories.map((c) => (
                <li key={c}>
                  <Link
                    to={`/search/category/${c}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    {c}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </aside>
    <main>
    
      <Route path="/cart/:id?" component={CartScreen} />
    <Route path="/product/:id" component={ProductScreen} exact/>
    <Route
            path="/product/:id/edit"
            component={ProductEditScreen}
            exact
          ></Route>
    <Route path="/signin" component={SigninScreen}/>
    <Route path="/register" component={RegisterScreen}/>
    <Route path="/password/forgot" component={ForgotPasswordScreen} exact />
          <Route path="/password/reset/:token" component={NewPasswordSceen} exact />
    <Route path="/shipping" component={ShippingAddressScreen}/>
    <Route path="/payment" component={PaymentMethodeScreen}/>
    <Route path="/placeorder" component={PlaceOrderScreen}/>
    <Route path="/order/:id" component={OrderScreen}/>
    <Route path="/orderhistory" component={OrderHistoryScreen}/>
    <Route
            path="/search/name/:name?"
            component={SearchScreen}
            exact
          ></Route>
          <Route
            path="/search/category/:category"
            component={SearchScreen}
            exact
          ></Route>
          <Route
            path="/search/category/:category/name/:name"
            component={SearchScreen}
            exact
          ></Route>
           <Route
            path="/search/category/:category/name/:name/brand/:brand/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber"
            component={SearchScreen}
            exact
          ></Route>
    <PrivateRoute path="/profile" component={ProfileSceen}/>
     <AdminRoute path="/productList" exact component={ProductListScreen}></AdminRoute>
     <AdminRoute path="/productList/namee/:namee" exact component={ProductListScreen}></AdminRoute>
     <AdminRoute
            path="/productlist/pageNumber/:pageNumber"
            component={ProductListScreen}
            exact
          ></AdminRoute>
     <AdminRoute
            path="/orderlist"
            component={OrderListScreen}
            exact
          ></AdminRoute>
           <AdminRoute
            path="/orderlist/pageNumber/:pageNumber"
            component={OrderListScreen}
            exact
          ></AdminRoute>
           <AdminRoute
            path="/orderlist/num/:num"
            component={OrderListScreen}
            exact
          ></AdminRoute>
           <AdminRoute path="/userlist" component={UsersListScreen}
           exact></AdminRoute>
             <AdminRoute path="/userlist/name/:name" component={UsersListScreen}
           exact></AdminRoute>
           <AdminRoute
            path="/user/:id/edit"
            component={UserEditScreen}
          ></AdminRoute>
          <AdminRoute
            path="/dashboard"
            component={DashboardScreen}
          ></AdminRoute>
            <Route path="/pageNumber/:pageNumber" component={HomeScreen} exact/>

      <Route path="/" component={HomeScreen} exact/>

        </main>
        <footer className="row center">
        Tous droits réservés
        </footer>
</div>  
</BrowserRouter >
  );
}

export default App;
