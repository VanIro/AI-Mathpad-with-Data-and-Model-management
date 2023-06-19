import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './index.css';
import reportWebVitals from './reportWebVitals';

import { AuthProvider } from './auth/AuthContext';
import Navbar from './components/navbar';
import App from './App';
import PrivateRoute from './auth/privateRoute'

import Login from "./views/loginPage";
import Register from "./views/registerPage";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route exact Component={App} path="/" />
        <Route exact Component={Login} path="/login" />
        <Route Component={Register} path="/register" />

      </Routes>
      {/* <App /> */}
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
