import { Route, Navigate, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./AuthContext";

const PrivateRoute = ({ children, ...rest }) => {
  let navigate = useNavigate();
  let { user } = useContext(AuthContext);
  if (!user){
    console.log('User not logged in!',user);
    // navigate('/login')
    return null;
  }
  else{
    return children
  }
//   return <Route {...rest}>{!user ? <Navigate to="/login" /> : children}</Route>;
};

export default PrivateRoute;