import React, { useEffect } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { NEW_PASSWORD_RESET } from '../constants/UserConstant';

export default function NewPasswordSceen(props) {
 const token=props.match.params.token;
   const dispatch=useDispatch();


   const resetPassword=useSelector((state)=>state.resetPassword);
   const {loading,error,success}=resetPassword;

  const [password,setPassword]=useState('');
   const [confirmPassword,setConfirmPassword]=useState('');
    useEffect(()=>{
      if(success){
        props.history.push(`/signin`);
        dispatch({type:NEW_PASSWORD_RESET});
      }
   },[dispatch, props.history, success])
   const submitHandler=(e)=>{
      e.preventDefault();
  if(password !==confirmPassword){
      alert('Passaword and Confiem Password Are Not Matched');
  }else{
      dispatch(resetPassword({token,password}))
  }
   }
    return (
        <div>
            <form  className="form" onSubmit={submitHandler}>
                <div>
                    <h1>New Password</h1>
                </div>
                {
                    loading?<LoadingBox></LoadingBox>
                    :
                    error? <MessageBox variant="danger">{error}</MessageBox>
                    :
                    <>
                    <div>
                        <label htmlFor="password">Password</label>
                         <input id="password" type="password" placeholder="Enter password" 
                          onChange={(e)=>setPassword(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">confirm Password</label>
                         <input id="confirmPassword" type="password" placeholder="confirm Password" 
                          onChange={(e)=>setConfirmPassword(e.target.value)}></input>
                    </div>
                    <div>
                        <label />
                        <button className="primary" type="submit">Update</button>
                    </div>
                    </>  
                }
            </form>
        </div>
    )
}
