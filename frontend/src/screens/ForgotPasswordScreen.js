import React, { useEffect, useState } from 'react';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import { forgotpassword } from '../action/UserActions';
import { FORGOT_PASSWORD_RESET } from '../constants/UserConstant';

export default function ForgotPasswordScreen(props) {
  
   const [email,setEmail]=useState('');
  
   const forgotPassword=useSelector((state)=>state.forgotPassword);
   const {success,loading,error}=forgotPassword;

   const dispatch = useDispatch();
    const submitHandler = (e) =>{
       e.preventDefault();
       dispatch(forgotpassword(email));
       }
   
   useEffect(()=>{
       if(success){
          alert('Check your mail');
          dispatch({type:FORGOT_PASSWORD_RESET})
       }
   },[dispatch, success]);

    return (
        <div>
            <form onSubmit={submitHandler} className="form">
                <div>
                    <h1>Forgot Password</h1>
                </div>
                {loading && <LoadingBox/>}
                {error && <MessageBox variant="danger">{error}</MessageBox>} 
                <div>
                    <label htmlFor="email">Email address</label>
                    <input type="email" id="email" placeholder="Enter email" required onChange={e => setEmail(e.target.value)}/>
                </div>
                 <div>
                     <label/>
                     <button className="primary" type="submit">Send Email</button>
                 </div>
            </form>
        </div>
    )
}
