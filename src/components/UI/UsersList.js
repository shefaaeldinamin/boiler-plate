import UserItem from "./UserItem";
import classes from "./UsersList.module.css";


const UsersList = (props) => {
  const pageUsers = props.pageUsers;
  return (
    <div className={classes.container}>
    {pageUsers.map((user) => (
        <UserItem key={user.id} name={user.name} mobileNumber={user['mobile_number']} />
      ))}
    </div>
  );
};

export default UsersList;
