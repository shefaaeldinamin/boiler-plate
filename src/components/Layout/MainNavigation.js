import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const logoutHandler = () => {
    authCtx.logout();
  };
  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>Boiler plate</div>
      </Link>
      <nav>
        <ul>
          <li>{!authCtx.isLoggedIn && <Link to="/login">Login</Link>}</li>
          <li>{!authCtx.isLoggedIn && <Link to="/register">Register</Link>}</li>
          <li>{authCtx.isLoggedIn && <Link to="/users">Users</Link>}</li>
          <li>
            {authCtx.isLoggedIn && (
              <button onClick={logoutHandler}>Logout</button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
