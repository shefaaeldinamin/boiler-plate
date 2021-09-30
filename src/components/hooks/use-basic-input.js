import { useReducer, useState } from "react";

const useBasicInput = (validateValue) => {
  const initialInputState = {
    value: "",
    isTouched: false,
  };

  const inputReducer = (state, action) => {
    if (action.type === "INPUT") {
      return {
        value: action.value,
        isTouched: state.isTouched,
      };
    }
    if (action.type === "BLUR") {
      return {
        value: state.value,
        isTouched: true,
      };
    }
    if (action.type === "RESET") {
      return {
        value: "",
        isTouched: false,
      };
    }
    return initialInputState;
  };

  const [inputState, dispatch] = useReducer(inputReducer, initialInputState);

  let enteredValueIsValid = validateValue(inputState.value);
  let valueHasError = !enteredValueIsValid && inputState.isTouched;

  const valueChangehandler = (event) => {
    if (typeof event === "object") {
      dispatch({
        type: "INPUT",
        value: event.target.value,
      });
    } else {
      dispatch({
        type: "INPUT",
        value: event,
      });
    }
  };

  const valueBlurHandler = () => {
    dispatch({
      type: "BLUR",
    });
  };

  const reset = () => {
    dispatch({
      type: "RESET",
    });
  };

  return {
    value: inputState.value,
    enteredValueIsValid,
    valueHasError,
    valueChangehandler,
    valueBlurHandler,
    reset,
  };
};

export default useBasicInput;
