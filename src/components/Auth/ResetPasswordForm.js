import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import useBasicInput from "../hooks/use-basic-input";

import classes from "./AuthForm.module.css";

const ResetPasswordForm = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const {
    value: enteredPassword,
    enteredValueIsValid: passwordIsValid,
    valueHasError: passwordHasError,
    valueChangehandler: passwordChangehandler,
    valueBlurHandler: passwordBlurHandler,
    reset: passwordReset,
  } = useBasicInput((value) => !(value.length < 8));

  const {
    value: enteredPasswordConfirmation,
    enteredValueIsValid: passwordConfirmationIsValid,
    valueHasError: passwordConfirmationHasError,
    valueChangehandler: passwordConfirmationChangehandler,
    valueBlurHandler: passwordConfirmationBlurHandler,
    reset: passwordConfirmationReset,
  } = useBasicInput((value) => value === enteredPassword);

  let formIsValid = passwordConfirmationIsValid && passwordIsValid;

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();

    setIsLoading(true);
    const url = "https://boiler-stage.ibtikar.sa/api/v1/users/password/reset";
    console.log(authCtx.forgotPasswordToken);

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        token: authCtx.forgotPasswordToken,
        email: authCtx.forgotPasswordEmail,
        password: enteredPassword,
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
          return res.json().then((data) => {
            console.log(data);
            let errorMessage = "Authentication failed!";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log("pushed");
        history.replace("/login");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>Reset password</h1>
      <form onSubmit={submitHandler}>
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
        <div
          className={`${classes.control} ${
            passwordConfirmationHasError ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password_confirmation">Password confirmation</label>
          <input
            type="password"
            id="password_confirmation"
            required
            value={enteredPasswordConfirmation}
            onChange={passwordConfirmationChangehandler}
            onBlur={passwordConfirmationBlurHandler}
          />
          {passwordConfirmationHasError && (
            <p className={classes.error}>Password confirmation doesn't match</p>
          )}
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button disabled={formIsValid ? false : true}>Submit</button>
          )}
          {isLoading && <p> Laoding... </p>}
        </div>
      </form>
    </section>
  );
};

export default ResetPasswordForm;
