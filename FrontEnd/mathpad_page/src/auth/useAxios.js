import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "./AuthContext";

import { BASE_URL, URL_TOKEN_REFRESH, BACKEND_URL_UInfo } from "../backend_urls";

const useAxios = () => {
  const { authTokens, user, setUser, setAuthTokens, logoutUser } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL:BASE_URL,
    headers: { Authorization: `Bearer ${authTokens?.access}` }
  });

  const ab_controller = new AbortController();
  axiosInstance.interceptors.request.use(async req => {
    if (!authTokens) return req;

    const jwtinfo = jwt_decode(authTokens.access);
    const isExpired = dayjs.unix(jwtinfo.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    // const response = await axios.post(`${URL_TOKEN_REFRESH}`, {
    //   'content-type': 'application/json'
    //   // refresh: authTokens.refresh
    // });
    const res = await fetch(`${URL_TOKEN_REFRESH}`, {
      method: 'POST',
      credentials: 'include', // Include cookies in the request
    });

    if(res.status!==200){
      console.log('Error refreshing token',res)
      logoutUser();
      req.signal = ab_controller.signal;
      ab_controller.abort();
      return req;
    }

    let response_data = res.json();
    console.log(response_data)
    console.log('Token refreshed!')//, response_data)

    const user_data = await fetch(`${BACKEND_URL_UInfo}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+response_data.access
      }
    }).then(res => res.json());
    // console.log('fetched user data',user_data)
    response_data.user = {
      pk:jwt_decode(response_data.access).user_id,
      ...user_data
    };

    localStorage.setItem("authTokens", JSON.stringify(response_data));

    setAuthTokens(response_data);
    // setUser(jwt_decode(response_data.access));

    req.headers.Authorization = `Bearer ${response_data.access}`;
    return req;
  },
  error => {
    console.log('useaxios rejecting promise in interceptor')
    return Promise.reject(error);
  });

  return axiosInstance;
};

export default useAxios;