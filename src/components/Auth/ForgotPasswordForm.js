import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import useBasicInput from "../hooks/use-basic-input";

import classes from "./AuthForm.module.css";

const ForgotPasswordForm = () => {
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

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();

    setIsLoading(true);
    const url = "https://boiler-stage.ibtikar.sa/api/v1/users/password/forget";

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
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
          return res.json().then((response) => {
            throw new Error('This email is invalid!');
          });
        }
      })
      .then((response) => {
        console.log(response);
        authCtx.forgotPassword(enteredEmail);
        console.log(authCtx.forgotPasswordEmail);
        history.push("/verify-code");
      })
      .catch((err) => {
        setErrors((errors) => {
          return { ...errors, email: err.message };
        });
      });
  };

  return (
    <section className={classes.auth}>
      <h1>Forgot password</h1>
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
            value={enteredEmail}
            onChange={emailChangehandler}
            onBlur={emailBlurHandler}
          />
           {emailHasError && (
            <p className={classes.error}>Email format is invalid</p>
          )}
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>Submit</button>}
          {isLoading && <p> Laoding... </p>}
          {!emailHasError && errors.email && (
            <p className={classes.error}>{errors.email}</p>
          )}
        </div>
      </form>
    </section>
  );
};

export default ForgotPasswordForm;
