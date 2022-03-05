import React, { useEffect, useState } from 'react';
import  {Link} from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import { signin } from '../action/UserActions';

export default function SigninScreen(props) {
   const [email,setEmail]=useState('');
   const [password, setPassword] = useState('');

   const redirect =props.location.search ? props.location.search.split('=')[1]:'/';
   const userSignin=useSelector((state)=>state.userSignin);
   const {userInfo,loading,error}=userSignin;

   const dispatch = useDispatch();
    const submitHandler = (e) =>{
       e.preventDefault();
       dispatch(signin(email,password));
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
                    <h1>Déjà client ?</h1>
                </div>
                {loading && <LoadingBox/>}
                {error && <MessageBox variant="danger">{error}</MessageBox>}
                <div>
                    <label htmlFor="email">Adresse email</label>
                    <input type="email" id="email" placeholder="Entrez l'email" required onChange={e => setEmail(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" id="password" placeholder="Entrez le mote de passe" required onChange={e => setPassword(e.target.value)}/>
                </div>
                 <div>
                     <label/>
                     <button className="primary" type="submit">Se Connecter</button>
                 </div>
                 <div>
                     <label />
                     <div>
                     Pas encore client? {` `}
                        <Link to={`/register?redirect=${redirect}`}>Créez votre compte</Link>
                     </div>
                 </div>
                 <div>
                     <label />
                     <div>

                        <Link to="/password/forgot">Mot de passe oublié?</Link>
                     </div>
                 </div>
            </form>
        </div>
    )
}
