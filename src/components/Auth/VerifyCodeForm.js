import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import useBasicInput from "../hooks/use-basic-input";

import classes from "./AuthForm.module.css";

const ForgotPasswordForm = () => {
  const [errors, setErrors] = useState({});
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const {
    value: enteredToken,
    enteredValueIsValid: tokenIsValid,
    valueHasError: tokenHasError,
    valueChangehandler: tokenChangehandler,
    valueBlurHandler: tokenBlurHandler,
    reset: nameReset,
  } = useBasicInput((value) => !(value.length < 10));

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(authCtx.forgotPasswordEmail);
    setIsLoading(true);
    const url =
      "https://boiler-stage.ibtikar.sa/api/v1/users/password/validate-token";

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        token: enteredToken,
        email: authCtx.forgotPasswordEmail,
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
            console.log(response);
            let errorMessage = "Invalid code!";
            throw new Error(errorMessage);
          });
        }
      })
      .then((response) => {
        console.log(response);
        console.log(response.data.token);
        authCtx.forgetPasswordToken(enteredToken);
        history.replace("/reset-password");
      })
      .catch((err) => {
        setErrors((errors) => {
          return { ...errors, tokenError: err.message };
        });
        console.log(errors);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>Verify code</h1>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            tokenHasError ? classes.invalid : ""
          }`}
        >
          <label htmlFor="token">Code</label>
          <input
            type="text"
            id="token"
            required
            value={enteredToken}
            onChange={tokenChangehandler}
            onBlur={tokenBlurHandler}
          />
          {tokenHasError && (
            <p className={classes.error}>Code must be at least 10 characters</p>
          )}
        </div>
        <div className={classes.actions}>
          {!isLoading && <button disabled={tokenIsValid ? false : true}>Submit</button>}
          {isLoading && <p> Laoding... </p>}
          {!tokenHasError && errors.tokenError && (
            <p className={classes.error}>{errors.tokenError}</p>
          )}
        </div>
      </form>
    </section>
  );
};

export default ForgotPasswordForm;
