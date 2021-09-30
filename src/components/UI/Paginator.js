import "./Paginator.css";
import ReactPaginate from "react-paginate";
import { useHistory, useLocation } from "react-router";

const Paginator = (props) => {

  return (
    <ReactPaginate
      pageCount={props.pagesCount}
      pageRangeDisplayed={5}
      previousLabel={'<'}
      nextLabel={'>'}
      breakClassName={'page-item'}
      breakLinkClassName={'page-link'}
      containerClassName={'pagination'}
      pageClassName={'page-item'}
      pageLinkClassName={'page-link'}
      previousClassName={'page-item'}
      previousLinkClassName={'page-link'}
      nextClassName={'page-item'}
      nextLinkClassName={'page-link'}
      activeClassName={'active'}
      onPageChange={props.onPageChange}
    />
  );
};

export default Paginator;
