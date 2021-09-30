import classes from "./UserItem.module.css";

const UserItem = (props) => {
  return (
    <div className={classes.item}>
      <figure>
        <blockquote>
          <p>{props.name}</p>
        </blockquote>
        <figcaption>{props.mobileNumber}</figcaption>
      </figure>
    </div>
  );
};

export default UserItem;
