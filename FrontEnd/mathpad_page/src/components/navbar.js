import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import useAxios from "../auth/useAxios";

import {BACKEND_URL_logout} from "../backend_urls";

import './navbar.css'

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const axios_instance = useAxios();

  const handleLogOut=()=>{
    let resp = axios_instance.post(BACKEND_URL_logout).catch((error)=>{
      console.log(error);
    });
    // console.log('axios response',resp);
    logoutUser();
  }
  return (

    <nav className="navbar">
      <Link to="/"><div className="logo">AI Mathpad</div></Link>
      <ul className="nav-links">
        <div className="menu">  

          {user ? (
            <>
              <li><Link to="/"><span>Home</span></Link></li>
              {/* <li><Link to="/todoApp">My Todo List</Link></li> */}
              <li className="userDropCont">
                <Link ><span>Hello, {user['username']}</span></Link>
                <span></span>
                <ul className="dropdown">

                  <li onClick={handleLogOut}><Link><span>Logout</span> </Link></li>

                </ul>
              </li>
              {/* <li><button onClick={logoutUser}>Logout</button></li>     */}
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}

        </div>
      </ul>
    </nav>
  );
};

export default Navbar;