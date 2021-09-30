import { useState } from "react";
import { useHistory } from "react-router-dom";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";
import classes from "./AuthForm.module.css";
import useBasicInput from "../hooks/use-basic-input";

const RegisterForm = () => {
  const history = useHistory();
  const [errors, setErrors] = useState({});

  const validatePhoneNumber = (number) => {
    if (number.length < 5) {
      return false;
    } else {
      return isValidPhoneNumber(number);
    }
  };

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
    value: enteredName,
    enteredValueIsValid: nameIsValid,
    valueHasError: nameHasError,
    valueChangehandler: nameChangehandler,
    valueBlurHandler: nameBlurHandler,
    reset: nameReset,
  } = useBasicInput((value) => value.trim() !== "");

  const {
    value: enteredMobileNumber,
    enteredValueIsValid: mobileNumberIsValid,
    valueHasError: mobileNumberHasError,
    valueChangehandler: mobileNumberChangehandler,
    valueBlurHandler: mobileNumberBlurHandler,
    reset: mobileNumberReset,
  } = useBasicInput(validatePhoneNumber);

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

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();

    setIsLoading(true);
    const url = "https://boiler-stage.ibtikar.sa/api/v1/users";

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        name: enteredName,
        password_confirmation: enteredPasswordConfirmation,
        mobile_number: enteredMobileNumber,
        returnSecureToken: true,
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
            const responseErrors = data.errors;
            console.log(responseErrors);
            responseErrors.forEach((element) => {
              setErrors((errors) => {
                console.log(element);
                return { ...errors, [element.type]: element.error };
              });
            });
            throw new Error("Oops something went wrong!");
          });
        }
      })
      .then((data) => {
        history.push("/login");
      })
      .catch((err) => {});
  };

  return (
    <section className={classes.auth}>
      <h1>Register</h1>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            nameHasError ? classes.invalid : ""
          }`}
        >
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            required
            value={enteredName}
            onChange={nameChangehandler}
            onBlur={nameBlurHandler}
          />
          {nameHasError && <p className={classes.error}>Name is required</p>}
        </div>
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
          {!emailHasError && errors["email"] && (
            <p className={classes.error}>{errors["email"]}</p>
          )}
        </div>
        <div
          className={`${classes.control} ${
            mobileNumberHasError ? classes.invalid : ""
          }`}
        >
          <label htmlFor="mobile_number">Mobile number</label>
          <PhoneInput
            name="mobile_number"
            id="mobile_number"
            international
            defaultCountry="EG"
            required
            value={enteredMobileNumber}
            onChange={mobileNumberChangehandler}
            onBlur={mobileNumberBlurHandler}
          />
          {mobileNumberHasError && (
            <p className={classes.error}>Invalid mobile number</p>
          )}
          {!mobileNumberHasError && errors["mobile_number"] && (
            <p className={classes.error}>{errors["mobile_number"]}</p>
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
          {!isLoading && <button>Create Account</button>}
          {isLoading && <p> Laoding... </p>}
        </div>
      </form>
    </section>
  );
};

export default RegisterForm;
