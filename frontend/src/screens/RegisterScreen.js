import React, { useEffect, useState } from 'react';
import  {Link} from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../action/UserActions';

export default function RegisterScreen(props) {
   const [name,setName]=useState('');
   const [email,setEmail]=useState('');
   const [password, setPassword] = useState('');
   const [confirmpassword, setConfirmPassword] = useState('');
   const redirect =props.location.search ? props.location.search.split('=')[1]:'/';
   const userRegister=useSelector((state)=>state.userRegister);
   const {userInfo,loading,error}=userRegister;

   const dispatch = useDispatch();
    const submitHandler = (e) =>{
       e.preventDefault();
       if(password !==confirmpassword){
           alert('Password and confirm password are not match')
       }else{
       dispatch(register(name,email,password));
       }
   }
   useEffect(()=>{
       if(userInfo){
           props.history.push(redirect);
       }
   },[  props.history,redirect,userInfo]);

    return (
        <div>
            <form onSubmit={submitHandler} className="form">
                <div>
                    <h1>Créez un compte pour une expérience bien vissée</h1>
                </div>
                {loading && <LoadingBox/>}
                {error && <MessageBox variant="danger">{error}</MessageBox>}
                 <div>
                    <label htmlFor="name">nom</label>
                    <input type="text" id="name" placeholder="Entrez votre nom" required onChange={e => setName(e.target.value)}/>
                </div>  
                <div>
                    <label htmlFor="email">Adresse email</label>
                    <input type="email" id="email" placeholder="Entrez votre email" required onChange={e => setEmail(e.target.value)}/>
                </div>
   
                <div>
                    <label htmlFor="Mot de passe">Password</label>
                    <input type="password" id="password" placeholder="Mot de passe" required onChange={e => setPassword(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                    <input type="password" id="confirmPassword" placeholder="Réécrire le Mot de passe" required onChange={e => setConfirmPassword(e.target.value)}/>
                </div>
                 <div>
                     <label/>
                     <button className="primary" type="submit">S'inscrire</button>
                 </div>
                 <div>
                     <label />
                     <div>
                     Vous avez déjà un compte? {` `}
                        <Link to={`/signin?redirect=${redirect}`}>Connexion</Link>
                     </div>
                 </div>
            </form>
        </div>
    )
}
