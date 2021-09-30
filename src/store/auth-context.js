import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  forgotPasswordEmail : "",
  login: (token) => {},
  logout: () => {},
  forgotPassword: (email) => {}
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState(null);
  const [forgotPasswordToken, setForgotPasswordToken] = useState(null);

  const userIsloggedIn = !!token;
  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem('token',token);
  };
  const logOutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const forgotPasswordHandler = (email) => {
    setForgotPasswordEmail(email)
  };

  const forgotPasswordTokenHandler = token => {
    setForgotPasswordToken(token);
  }

  const contextValue = {
    token: token,
    isLoggedIn: userIsloggedIn,
    forgotPasswordEmail:forgotPasswordEmail,
    forgotPasswordToken:forgotPasswordToken,
    login: loginHandler,
    logout: logOutHandler,
    forgotPassword: forgotPasswordHandler,
    forgetPasswordToken: forgotPasswordTokenHandler
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
