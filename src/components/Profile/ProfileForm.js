import { useContext, useRef } from "react";
import { useHistory } from "react-router";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const enteredPassword = useRef();
  const changePasswordHandler = (event) => {
    event.preventDefault();
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyA9SuwSXQtFkoHbE2IPJ32BiGxu7BC_eG8', {
      method: "POST",
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredPassword.current.value,
        returnSecureToken: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => {
      history.replace('/');
    });
  };

  return (
    <form className={classes.form} onSubmit={changePasswordHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={enteredPassword} minLength = '7' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
