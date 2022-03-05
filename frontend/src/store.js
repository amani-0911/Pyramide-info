//create redux store :initstate+reducer 
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import { cartReducer } from './reduces/cartReducer';
import { orderCreateReducer, orderDeleteReducer, orderDeliverReducer, orderDetailsReducer, orderListReducer, orderMineListReducer, OrderPayReducer, orderSummaryReducer } from './reduces/OrderReducer';
import { productBrandListReducer, productCategoryListReducer, productCreateReducer, productDeleteReducer, productDetailsReducer, productListReducer, productReviewCreateReducer, productUpdateReducer } from './reduces/productReducer';
import { forgotPasswordReducer, ResetPasswordReducer, userDeleteReducer, userDetailsReducer, userListReducer, userRegisterReducer, userSigninReducer, userUpdateProfileReducer, userUpdateReducer } from './reduces/userReducers';

const initialState={
  userSignin:{
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  },
  cart:{
  cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
  shippingAddress: localStorage.getItem('shippingAddress') ?JSON.parse(localStorage.getItem('shippingAddress')) :{},
  paymentMethod:'PayPal',
}
};
const reducer=combineReducers({
  productList: productListReducer,
  productDetails:productDetailsReducer,
  cart:cartReducer,
  userSignin:userSigninReducer,
  userRegister:userRegisterReducer, 
  forgotPassword: forgotPasswordReducer,
  resetPassword:ResetPasswordReducer,
  orderCreate:orderCreateReducer,
  orderDetails:orderDetailsReducer,
  orderPay:OrderPayReducer,
  orderMineList:orderMineListReducer,
  userDetails:userDetailsReducer,
  userUpdateProfile:userUpdateProfileReducer,
  productCreate:productCreateReducer,
  productDelete:productDeleteReducer,
  productUpdate: productUpdateReducer,
  orderList: orderListReducer,
  orderDelete: orderDeleteReducer,
  orderDeliver:orderDeliverReducer,
  userUpdate: userUpdateReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  productCategoryList: productCategoryListReducer,
  pructBrandList:productBrandListReducer,
  productReviewCreate: productReviewCreateReducer,
  orderSummary: orderSummaryReducer,
 
});
const composeEnhancer=window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store= createStore(reducer,initialState,composeEnhancer(applyMiddleware(thunk)));

export default store;