import React, { useEffect } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { detailsUser, updateUsers } from '../action/UserActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_RESET } from '../constants/UserConstant';

export default function UserEditScreen(props) {

   const userDetails=useSelector((state)=>state.userDetails);
   const {loading,error,user}=userDetails;
 
   const userUpdate = useSelector((state) => state.userUpdate); 
   const {success:successUpdate,error:errorUpdate,loading:loadingUpdate}=userUpdate;
   
   const userId=props.match.params.id;
   const [email,setEmail]=useState('');
   const [name,setName]=useState('');
   const [isAdmin,setIsAdmin]=useState(false);
   const dispatch=useDispatch(); 
    
      useEffect(()=>{
        if(successUpdate){
        dispatch({type:USER_UPDATE_RESET})
    props.history.push('/userlist');
        }
        if(!user){
         dispatch(detailsUser(userId))
        }else{
      setEmail(user.email);
      setName(user.name);
      setIsAdmin(user.isAdmin);
        }
   },[dispatch, props.history, successUpdate, user, userId])
   const submitHandler=(e)=>{
      e.preventDefault();
      dispatch(updateUsers({_id:userId,email,name,isAdmin}))
  
   }
    return (
        <div>
             <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Edit User {name}</h1>
          {loadingUpdate && <LoadingBox></LoadingBox>}
          {errorUpdate && (
            <MessageBox variant="danger">{errorUpdate}</MessageBox>
          )}
        </div>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="isAdmin">Is Admin</label>
              <input
                id="isAdmin"
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></input>
            </div>
            <div>
              <button type="submit" className="primary">
                Update
              </button>
            </div>
          </>
        )}
      </form>
        </div>
    )
}
