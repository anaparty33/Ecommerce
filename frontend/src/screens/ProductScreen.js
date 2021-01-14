import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Image,
  ListGroup,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import axios from "axios";
import { listProductDetails, CreateReview } from "../actions/productAction.js";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader.js";
import Message from "../components/Message.js";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstant.js";
import Meta from "../components/Meta";

const ProductScreen = ({ match, history }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { loading, product, error } = useSelector(
    (state) => state.productDetail
  );

  const { success: successReview } = useSelector(
    (state) => state.productCreateReview
  );

  const { userInfo } = useSelector((state) => state.userLogin);
  console.log(product);
  useEffect(() => {
    if (successReview) {
      alert("Review Submitted Successfully");
      setComment("");
      setRating(0);
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }

    dispatch(listProductDetails(match.params.id));
  }, [match, successReview]);

  const onAddToCart = (e) => {
    history.push(`/cart/${match.params.id}/?qty=${quantity}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(CreateReview(product, { rating: rating, comment: comment }));
  };

  return (
    <>
      <Link to="/">
        <Button variant="light"> back</Button>
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error} </Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>{" "}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    rating={product.rating}
                    text={`${product.numReviews} reviews`}
                  ></Rating>
                </ListGroup.Item>
                <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description:{product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        $ <strong>{product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0
                          ? "In Stock "
                          : "Sorry! Out of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Quantity:</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            onChange={(e) => setQuantity(e.target.value)}
                            value={quantity}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (ele) => {
                                return (
                                  <option key={ele + 1} value={ele + 1}>
                                    {ele + 1}
                                  </option>
                                );
                              }
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={(e) => {
                        onAddToCart(e);
                      }}
                      className="btn-block"
                      type="submit"
                      disabled={product.countInStock === 0}
                    >
                      ADD TO CART
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h3>Reviews</h3>
              <ListGroup variant="flush">
                {product.reviews.length === 0 ? (
                  <Message>No reviews</Message>
                ) : (
                  product.reviews.map((review) => (
                    <ListGroup.Item>
                      <strong>{review.name}</strong>
                      <p>
                        <Rating rating={review.rating}></Rating>
                      </p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))
                )}

                <h3>write a review</h3>

                {userInfo ? (
                  <Form onSubmit={submitHandler}>
                    <Form.Group>
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="1">1-Poor</option>
                        <option value="2">2-Fair</option>
                        <option value="3">3-Good</option>
                        <option value="4">4-Very Good</option>
                        <option value="5">5-Excellent</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                    <Button type="submit" variant="primary">
                      Submit
                    </Button>
                  </Form>
                ) : (
                  <p>
                    {" "}
                    Please <Link to="/login">Login</Link> to write review
                  </p>
                )}
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
