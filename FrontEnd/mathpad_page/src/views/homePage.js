import { useContext } from "react";
import AuthContext from "../auth/AuthContext";

import './homePage.css'

const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="content-wrap">

      <h1>You are on the home page!</h1>
      <br/>
      <br/>

      <h3>
        <ul>
          <li>This apps gives you secure CRUD access to your todos.</li>
          <br/>
          {user && <>
              <li>Go to<b> My Todo List </b>for interacting with your todos.</li><br/>
              <li>Hover on Hello, <b>{user['username']}</b> to see the account options.</li><br/>
          </>}
          {!user && <>
            <li>Login to use the todo app.</li><br/>
            <li>If you haven't signed up yet, do register.</li>
          </>}
        </ul>
      </h3>
    </div>
  );
};

export default Home;