import { createContext, useState, useEffect } from "react";
// import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

import {BACKEND_URL_login, BACKEND_URL_logout, BACKEND_URL_register } from "../backend_urls";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>{
    if(localStorage.getItem("authTokens")){
      try{
        return JSON.parse(localStorage.getItem("authTokens"))
      }catch(e){  
        console.log('Error parsing authTokens',e);
        return null;
      }
    }
    return null;
  }
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? localStorage.getItem("authTokens").user//jwt_decode(localStorage.getItem("authTokens"))
      : null
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    // console.log(email);
    const responseP = fetch(BACKEND_URL_login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    responseP.then((response) => {
      response.json().then((data) => {
        if (response.status === 200) {
          // console.log('response',data['access'],data['user']);
  
          // const response2 = await fetch(BACKEND_URL_UInfo, {
          //   method: "GET",
          //   headers: {
          //     "Content-Type": "application/json",
          //     // "Authorization": "Token "+data['key']
          //     "Authorization": "Bearer "+data['access']
          //   }
          // });
          // const user_info = await response2.json();
          // if(response2.status===200){
          //   console.log("Success fetching user information...")
          //   data['user_info']=user_info;
          // }
          
          // console.log(data)
          console.log('Login success!');
          setAuthTokens(data);
          setUser(data['user'])//jwt_decode(data['key']));
          localStorage.setItem("authTokens", JSON.stringify(data))
          navigate("/");
          return 0;
        } else {
          // alert("Something went wrong!");
          return 1;
        }
      });


    })
    responseP.catch((error) => {
      console.log('Error:', error);
      return 1;
    });

    const retVal =  await responseP;

    return retVal;
    
  };
  
  const registerUser = async (username,email, password1, password2) => {
    // let username='';
    console.log(JSON.stringify({
      username,
      email,
      password1,
      password2
    }));
    const response = await fetch(BACKEND_URL_register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        password1,
        password2
      })
    });
    if (response.status === 201) {
        navigate("/login");
    } else {
        console.log(response)
      alert("Something went wrong!");
    }
  };

  const logoutUser = async () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/");
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser
  };

  useEffect(() => {
    // console.log('useEffect [authtokens,loading]');
    if (authTokens) {
      setUser(authTokens.user)//jwt_decode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
