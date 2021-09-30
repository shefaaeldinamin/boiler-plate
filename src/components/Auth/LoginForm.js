import { useContext, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import useBasicInput from "../hooks/use-basic-input";

import classes from "./AuthForm.module.css";

const LoginForm = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const {
    value: enteredEmail,
    enteredValueIsValid: emailIsValid,
    valueHasError: emailHasError,
    valueChangehandler: emailChangehandler,
    valueBlurHandler: emailBlurHandler,
    reset: emailReset,
  } = useBasicInput(validateEmail);

  const {
    value: enteredPassword,
    enteredValueIsValid: passwordIsValid,
    valueHasError: passwordHasError,
    valueChangehandler: passwordChangehandler,
    valueBlurHandler: passwordBlurHandler,
    reset: passwordReset,
  } = useBasicInput((value) => !(value.length < 8));

  let formIsValid = emailIsValid && passwordIsValid;

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const url = "https://boiler-stage.ibtikar.sa/api/v1/users/login";

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        client_id: 2,
        client_secret: "fhMZQxfVREJrII50IeN4ThIZCerdOFjxiRGu7Lc0",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          let errorMessage =
            res.status === 401
              ? "Wrong credentials!"
              : "Oops something went wrong, please try again later!";
          throw new Error(errorMessage);
        }
      })
      .then((response) => {
        console.log(`Access token = ${response.data.access_token}`);
        authCtx.login(response.data.access_token);
        history.push("/");
      })
      .catch((err) => {
        setErrors((errors) => {
          return { ...errors, credentialsError: err.message };
        });
        console.log(errors);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>Login</h1>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailHasError ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            required
            onChange={emailChangehandler}
            onBlur={emailBlurHandler}
            value={enteredEmail}
          />
          {emailHasError && (
            <p className={classes.error}>Email format is invalid</p>
          )}
        </div>
        <div
          className={`${classes.control} ${
            passwordHasError ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
            onChange={passwordChangehandler}
            onBlur={passwordBlurHandler}
            value={enteredPassword}
          />
          {passwordHasError && (
            <p className={classes.error}>
              Password must be at least 8 characters
            </p>
          )}
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button disabled={formIsValid ? false : true}>Login</button>
          )}
          {isLoading && <p> Laoding... </p>}
          <Link to="/forgot-password">Forgot password?</Link>
          {errors.credentialsError && (
            <p className={classes.error}>Wrong credentials!</p>
          )}
        </div>
      </form>
    </section>
  );
};

export default LoginForm;
