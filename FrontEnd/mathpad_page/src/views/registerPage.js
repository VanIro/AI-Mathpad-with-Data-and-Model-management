import { useState, useContext } from "react";
import AuthContext from "../auth/AuthContext";
import { Link } from "react-router-dom";

import './registerPage.css'

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async e => {
    e.preventDefault();
    registerUser(username, email, password, password2);
  };

  return (

    <div className="login-wrap">
      <h2>Register</h2>
      
      <div className="form">
        <input 
          type="text" 
          id="username" 
          placeholder="Username"  
          onChange={e => setUsername(e.target.value)} 
          required 
          name="un" 
        />
        <input 
          type="text" 
          id="email" 
          placeholder="Email"  
          onChange={e => setEmail(e.target.value)} 
          required 
          name="em" 
        />
        <input
            type="password"
            id="password"
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
        />
        <input
            type="password"
            id="confirm-password"
            onChange={e => setPassword2(e.target.value)}
            placeholder="Confirm Password"
            required
        />
        <p className="warning">{password2 !== password ? "Passwords do not match" : ""}</p>
        <button onClick={handleSubmit}> Register </button>
        <Link to="/login"><p> Already have an account? Just Sign in. </p></Link>
      </div>
    </div>
    // <section>
    //   <form onSubmit={handleSubmit}>
    //     <h1>Register</h1>
    //     <hr />
    //     <div>
    //       <label htmlFor="username">Username</label>
    //       <input
    //         type="text"
    //         id="username"
    //         onChange={e => setUsername(e.target.value)}
    //         placeholder="Username"
    //         required
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="password">Password</label>
    //       <input
    //         type="password"
    //         id="password"
    //         onChange={e => setPassword(e.target.value)}
    //         placeholder="Password"
    //         required
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="confirm-password">Confirm Password</label>
    //       <input
    //         type="password"
    //         id="confirm-password"
    //         onChange={e => setPassword2(e.target.value)}
    //         placeholder="Confirm Password"
    //         required
    //       />
    //       <p>{password2 !== password ? "Passwords do not match" : ""}</p>
    //     </div>
    //     <button>Register</button>
    //   </form>
    // </section>
  );
}

export default Register;
