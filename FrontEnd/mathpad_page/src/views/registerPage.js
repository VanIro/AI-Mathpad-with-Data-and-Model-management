import { useState, useContext } from "react";
import AuthContext from "../auth/AuthContext";
import { Link } from "react-router-dom";
import SyncLoader from "react-spinners/SyncLoader";

import './registerPage.css'

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [errorMsgs, setErrorMsgs] = useState([]); //["Error message 1", "Error message 2"
  const [fieldErrors, setFieldErrors] = useState({}); //["Error message 1", "Error message 2"

  const [registering, setRegistering] = useState(false); //["Error message 1", "Error message 2"

  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async e => {
    setRegistering(true);
    setErrorMsgs([]); //clear error messages
    e.preventDefault();
    registerUser(username, email, password, password2).then((ret) => {
      console.log('ret',ret);
      if(ret){
        const {success, detail, non_field_errors,...remnError} = ret; 
        // setErrorMsgs(errMsgs=>[...errMsgs,"Incorrect username or password."]);
        if(non_field_errors)
          setErrorMsgs(errMsgs=>[...errMsgs,...non_field_errors]);

        // console.log(remnError);
        setFieldErrors(remnError);
      }
      setRegistering(false);
    });
  };
  
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  }

  return (

    <div className="login-wrap">
      <h2>Register</h2>
      
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
            {fieldErrors['username'] &&
              fieldErrors['username'].map((msg, index) => (
                <li key={index}>{msg}</li>
              ))
            }
          </ul>
        </div>
        <input 
          type="text" 
          id="username" 
          placeholder="Username"  
          onChange={e => setUsername(e.target.value)} 
          onKeyDown={handleKeyPress}
          required 
          name="un" 
        />
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
          onChange={e => setEmail(e.target.value)} 
          onKeyDown={handleKeyPress}
          required 
          name="em" 
        />
        <div className="error-message">
          <ul>
            {fieldErrors['password1'] &&
              fieldErrors['password1'].map((msg, index) => (
                <li key={index}>{msg}</li>
              ))
            }
          </ul>
        </div>
        <input
            type="password"
            id="password"
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            onKeyDown={handleKeyPress}
            required
        />
        <div className="error-message">
          <ul>
            {fieldErrors['password2'] &&
              fieldErrors['password2'].map((msg, index) => (
                <li key={index}>{msg}</li>
              ))
            }
          </ul>
        </div>
        <input
            type="password"
            id="confirm-password"
            onChange={e => setPassword2(e.target.value)}
            placeholder="Confirm Password"
            onKeyDown={handleKeyPress}
            required
        />
        <p className="warning">{password2 !== password ? "Passwords do not match" : ""}</p>
        <button onClick={handleSubmit} style={{position:'relative'}}> 
          {registering?'Registering':'Register' }
          <SyncLoader
          color={'white'}
          loading={registering}
          size={15}
          cssOverride={{'position':'absolute',right:'0'}}
          // over
        />
           
        </button>
        <Link to="/login"><p> Already have an account? Just Sign in. </p></Link>
      </div>
    </div>
  );
}

export default Register;
