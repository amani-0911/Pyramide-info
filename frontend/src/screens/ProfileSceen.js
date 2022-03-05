import React, { useEffect } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { detailsUser, updateUser } from '../action/UserActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/UserConstant';

export default function ProfileSceen() {
   const dispatch=useDispatch();
   const userSignin=useSelector((state)=>state.userSignin);
   const userDetails=useSelector((state)=>state.userDetails);
   const userUpdateProfile=useSelector((state)=>state.userUpdateProfile);
   const {loading,error,user}=userDetails;
   const {userInfo}=userSignin;
   const {success:successUpdate,error:errorUpdate,loading:loadingUpdate}=userUpdateProfile
   const [email,setEmail]=useState('');
   const [name,setName]=useState('');
   const [password,setPassword]=useState('');
   const [confirmPassword,setConfirmPassword]=useState('');
    useEffect(()=>{
        if(!user){
        dispatch({type:USER_UPDATE_PROFILE_RESET})
       dispatch(detailsUser(userInfo._id))
        }else{
           setEmail(user.email) ;
           setName(user.name);
        }
   },[dispatch, userInfo._id,user])
   const submitHandler=(e)=>{
      e.preventDefault();
  if(password !==confirmPassword){
      alert('Passaword and Confiem Password Are Not Matched');
  }else{
      dispatch(updateUser({userId:user._id,email,name,password}))
  }
   }
    return (
        <div>
            <form  className="form" onSubmit={submitHandler}>
                <div>
                    <h1>User Profile</h1>
                </div>
                {
                    loading?<LoadingBox></LoadingBox>
                    :
                    error? <MessageBox variant="danger">{error}</MessageBox>
                    :
                    <>
                    {loadingUpdate && <LoadingBox />}
                    {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
                     {successUpdate && <MessageBox variant="success">Profile Updated Successfully</MessageBox>}
                    <div>
                        <label htmlFor="name">Name</label>
                         <input id="name" type="text" placeholder="Enter name" value={name}
                         onChange={(e)=>setName(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                         <input id="email" type="email" placeholder="Enter email" value={email}
                         onChange={(e)=>setEmail(e.target.value)}></input>
                    </div>
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
