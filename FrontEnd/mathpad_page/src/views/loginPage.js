import { useContext, useState } from "react";
import AuthContext from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

import SyncLoader from "react-spinners/SyncLoader";

import './loginPage.css'

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsgs, setErrorMsgs] = useState([]); //["Error message 1", "Error message 2"
  const [fieldErrors, setFieldErrors] = useState({}); //["Error message 1", "Error message 2"

  const [signingIn, setSigningIn] = useState(false); //["Error message 1", "Error message 2"

  const handleSubmit = e => {
    e.preventDefault();
    
    setErrorMsgs([]); //clear error messages
    if(email.length > 0 && password.length > 0){
      setSigningIn(true);
      const handleSuccess = ()=>{
        navigate('/');
      }
      loginUser(email, password,handleSuccess).then((ret) => {
        // console.log('ret',ret);
        if(ret){
          const {success, detail, non_field_errors,...remnError} = ret; 
          // setErrorMsgs(errMsgs=>[...errMsgs,"Incorrect username or password."]);
          if(non_field_errors)
            setErrorMsgs(errMsgs=>[...errMsgs,...non_field_errors]);

          // console.log(remnError);
          setFieldErrors(remnError);
        }
        setSigningIn(false);
      });
    }
    else{
      // alert("Please enter your email");
      setErrorMsgs(errMsgs=>[...errMsgs,"Please enter both your email and password."]);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  }

  return (

    <div className="login-wrap">
      <h2>Login</h2>
      <br/>
      <div className="error-message">
        <ul>
          {
            errorMsgs.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))
          }
        </ul>
      </div>
      <div className="form">
        <div className="error-message">
          <ul>
            {fieldErrors['email'] &&
              fieldErrors['email'].map((msg, index) => (
                <li key={index}>{msg}</li>
              ))
            }
          </ul>
        </div>
        <input 
          type="text" 
          id="email" 
          placeholder="Email"  
          name="em" 
          onChange={e => setEmail(e.target.value)} 
          onKeyDown={handleKeyPress}
        />
        <div className="error-message">
          <ul>
            {fieldErrors['password'] &&
              fieldErrors['password'].map((msg, index) => (
                <li key={index}>{msg}</li>
              ))
            }
          </ul>
        </div>
        <input 
          type="password" 
          placeholder="Password" 
          name="pw" 
          onChange={e => setPassword(e.target.value)} 
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSubmit} style={{position:'relative'}}> 
          {signingIn?'Signing in':'Sign in' }
          <SyncLoader
          color={'white'}
          loading={signingIn}
          size={15}
          cssOverride={{'position':'absolute',right:'0'}}
          // over
        />
        </button>
        <Link to="/register"><p> Don't have an account? Register </p></Link>
      </div>
    </div>
  );
};

export default LoginPage;