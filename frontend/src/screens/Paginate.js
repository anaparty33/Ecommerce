import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, pageNumber, isAdmin = false, keyword }) => {
  return pages > 1 && <Pagination></Pagination>;
};

export default Paginate;
