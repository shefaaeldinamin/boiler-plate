import { Fragment, useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import Paginator from "../components/UI/Paginator";
import UsersList from "../components/UI/UsersList";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import classes from "./pages.module.css";

const UsersPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageNumber = queryParams.get("page");
  const search = queryParams.get("search");
  const [users, setUsers] = useState([]);
  const [pagesCount, setpagesCount] = useState(null);
  const searchkeyword = useRef();

  const pageChangeHandler = (page) => {
    history.push({
      pathname: location.pathname,
      search: `?page=${page.selected + 1}&search=${search}`,
    });
  };

  const searchHandler = (event) => {
    event.preventDefault;
    history.push({
      pathname: location.pathname,
      search: `?page=${pageNumber}&search=${searchkeyword.current.value}`,
    });
  };

  useEffect(() => {
    setIsLoading(true);
    let url = `https://boiler-stage.ibtikar.sa/api/v1/users?page=${
      pageNumber ?? ""
    }&name=${search ?? ""}`;
    fetch(url, {
      method: "GET",
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
            "Oops something went wrong, please try again later!";
          throw new Error(errorMessage);
        }
      })
      .then((response) => {
        console.log(response.data);
        setpagesCount(Math.ceil(response.meta.total / 10));
        setUsers(response.data);
        console.log(users);
      })
      .catch((err) => {
        alert(err.message);
      });
  }, [pageNumber, search]);

  return (
    <Fragment>
      <div className={classes.search}>
        <button onClick={searchHandler}>search</button>
        <input ref={searchkeyword} type="text"></input>
      </div>
      {isLoading && <LoadingSpinner />}
      {!isLoading && <UsersList pageUsers={users} />}
      <Paginator onPageChange={pageChangeHandler} pagesCount={pagesCount} />
    </Fragment>
  );
};

export default UsersPage;
