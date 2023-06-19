import { useContext, useState } from "react";
import AuthContext from "../auth/AuthContext";
import { Link } from "react-router-dom";

import './loginPage.css'

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    
    email.length > 0 && loginUser(email, password);
  };

  return (

    <div className="login-wrap">
      <h2>Login</h2>
      
      <div className="form">
        <input 
          type="text" 
          id="email" 
          placeholder="Email"  
          name="em" 
          onChange={e => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          name="pw" 
          onChange={e => setPassword(e.target.value)} 
        />
        <button onClick={handleSubmit}> Sign in </button>
        <Link to="/register"><p> Don't have an account? Register </p></Link>
      </div>
    </div>
  );
};

export default LoginPage;