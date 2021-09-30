import { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import AuthContext from "./store/auth-context";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import VerifyCodepage from "./pages/VerifyCodePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserItem from "./components/UI/UserItem";
import UsersPage from "./pages/UsersPage";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
        <Route path='/login'>
          <LoginPage/>
        </Route>
        <Route path='/forgot-password'>
          <ForgotPasswordPage/>
        </Route>
        <Route path='/verify-code'>
          <VerifyCodepage/>
        </Route>
        <Route path='/reset-password'>
          <ResetPasswordPage/>
        </Route>
        <Route path="/profile">
          {authCtx.isLoggedIn && <UserProfile />}
          {!authCtx.isLoggedIn && <Redirect to='/auth'/>}
        </Route>
        <Route path='/register'>
          <Register/>
        </Route>
        <Route path='/users'>
          <UsersPage/>
        </Route>
        <Route path='*' exact>
          <Redirect to='/'/>
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
