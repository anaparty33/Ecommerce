import React, { useEffect } from "react";
import { Col, Row, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Product from "../components/Product";
import Loader from "../components/Loader.js";
import Message from "../components/Message.js";
import { listProducts } from "../actions/productAction.js";
import { useDispatch, useSelector } from "react-redux";
import Paginate from "../components/Paginate.js";
import ProductCarousel from "./ProductCarousel.js";
import Meta from "../components/Meta";

const HomeScreen = ({ match }) => {
  const dispatch = useDispatch();

  const searchProduct = match.params.keyword ? match.params.keyword : "";
  const pageNumber = match.params.pageNumber || 1;

  console.log(searchProduct);

  const productslist = useSelector((state) => state.productList);
  console.log(productslist);

  const { loading, products, error, pages, page } = productslist;

  useEffect(() => {
    dispatch(listProducts(searchProduct, pageNumber));
  }, [dispatch, searchProduct, pageNumber]);

  return (
    <div>
      {!searchProduct ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          {" "}
          Back
        </Link>
      )}
      <h1>Latest products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" children={error} />
      ) : (
        <>
          <Meta />
          <Row>
            {products.map((product) => {
              return (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              );
            })}
          </Row>
          <Paginate page={page} pages={pages} keyword={searchProduct} />
        </>
      )}
    </div>
  );
};

export default HomeScreen;
