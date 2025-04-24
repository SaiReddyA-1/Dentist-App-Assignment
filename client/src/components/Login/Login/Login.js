import React, { useContext } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
// import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";

import firebaseConfig from './firebase.config';
import { UserContext } from '../../../App';
import { useHistory, useLocation } from 'react-router-dom';


const Login = () => {
  // const auth = getAuth();
  // const provider = new FacebookAuthProvider();
  

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }

  const handleFbSignIn = () => {
    var fbProvider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(fbProvider).then(function (result) {
      const { displayName, email } = result.user;
      const signedInUser = { name: displayName, email }
      setLoggedInUser(signedInUser);
      storeAuthToken();
    }).catch(function (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
  }

  // const handleFbSignIn = () => {
  //   signInWithPopup(auth, provider)
  //       .then((result) => {
        
  //         const { displayName, email } = result.user;

  //         const signedInUser = { name: displayName, email }
  //         setLoggedInUser(signedInUser);
  //         storeAuthToken();

          
  //         const credential = FacebookAuthProvider.credentialFromResult(result);
  //         const accessToken = credential.accessToken;

         
  //       })
  //       .catch((error) => {
         
  //         const errorCode = error.code;
  //         const errorMessage = error.message;
          
  //         const email = error.customData.email;
          
  //         const credential = FacebookAuthProvider.credentialFromError(error);
  //         console.log(errorMessage);

          
  //       });
  // }

  const handleGoogleSignIn = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
      const { displayName, email } = result.user;
      const signedInUser = { name: displayName, email }
      setLoggedInUser(signedInUser);
      storeAuthToken();
    }).catch(function (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
  }

  const storeAuthToken = () => {
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
      .then(function (idToken) {
        sessionStorage.setItem('token', idToken);
        history.replace(from);
      }).catch(function (error) {
        // Handle error
      });
  }

  return (
    <div className="login-page container" style={{width: '600px'}}>
      <div className="row align-items-center" style={{ height: "100vh" }}>
        <div className="col-md-12 shadow p-5 text-center">
          {/* <div className="form-group">
            <label htmlFor="">User Name</label>
            <input type="text" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="">Password</label>
            <input type="password" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="" className="text-danger">Forgot your password?</label>
          </div> */}
          <h3>You should sign in at first...</h3>
          <div className="from-group mt-5">
             <button className="btn btn-brand" onClick={handleGoogleSignIn}>Sign in with Google</button> &nbsp; &nbsp;
             <button className="btn btn-brand" onClick={handleFbSignIn} >Sign in with Facebook</button>
            
          </div>
          
        </div>
        {/* <div className="col-md-6 d-none d-md-block align-self-end">
          <img className="img-fluid" src={LoginBg} alt="" />
        </div> */}
      </div>
    </div>
  );
};

export default Login;