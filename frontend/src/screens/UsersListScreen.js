import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router';
import { deleteUser, listUsers } from '../action/UserActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function UsersListScreen(props) {
  const {name='all'}=useParams();
   const userList=useSelector((state)=>state.userList);
   const {loading,error,users}=userList;
   const userDelete=useSelector((state)=>state.userDelete);
   const { loading: loadingDelete,
    error: errorDelete,
    success: successDelete,}=userDelete;
   const dispatch=useDispatch();
   useEffect(()=>{
    dispatch(listUsers({name:name!=='all'? name:''}))
   },[dispatch, name, successDelete])
   const deleteHandler=(user)=>{
    if (window.confirm('Are you sure?')) {
        dispatch(deleteUser(user._id));
      }   
   }
   const [nameU,setNameU]=useState(name!=='all' ? name:'');
   const submitHandler = (e) => {
    e.preventDefault();
    props.history.push(`/userlist/name/${nameU}`);
  };

    return (
        <div>
          <div className="row">
          <h1>Utilisateurs</h1>
            <form className="search" onSubmit={submitHandler}>
                  <div className="row">
                    <input
                      type="text"
                      name="q"
                      value={nameU}
                      id="q"
                      placeholder="recherche une Utilisateur"
                      onChange={(e) => setNameU(e.target.value)}
                    ></input>
                    <button className="primary" type="submit">
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                </form>
          </div>
            {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {successDelete && (
        <MessageBox variant="success">User Deleted Successfully</MessageBox>
      )}
            {loading ? (<LoadingBox></LoadingBox>):
            error ? (<MessageBox variant="danger)">{error}</MessageBox>):(

                <table className="table">
                    <thead>
                        <tr>
                        <th>ID</th>
               <th>NOM</th>
               <th>EMAIL</th>
               <th>EST ADMIN</th>
               <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user)=>(
                            <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'OUI' : 'NON'}</td>
                <td>
                <button type="button" className="small"
                 onClick={() => props.history.push(`/user/${user._id}/edit`)}>
                    Modifier
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(user)}
                  >
                    Supprimer
                  </button>
                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
        </div>
    )
}
