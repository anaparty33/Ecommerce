import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Row, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import CheckoutSteps from "../components/CheckoutSteps.js";
import Message from "../components/Message.js";

import { createOrder } from "../actions/orderAction.js";

const PlaceorderScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);

  console.log(cart.shippingAddress);

  const dispatch = useDispatch();

  cart.itemsPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 10;

  cart.taxPrice = Number(cart.itemsPrice * 0.15).toFixed(2);

  cart.totalPrice =
    cart.itemsPrice + cart.shippingPrice + Number(cart.taxPrice);

  const { loading, success, order, error } = useSelector(
    (state) => state.createOrder
  );

  useEffect(() => {
    if (success) {
      // eslint-disable-next-line
      history.push(`/order/${order._id}`);
    }
  }, [success, history]);

  const handlePlaceorder = (e) => {
    e.preventDefault();

    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        itemsPrice: cart.itemsPrice,
        shippingAddress: cart.shippingAddress,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        paymentMethod: cart.paymentMethod,
      })
    );
  };

  return (
    <>
      <h1>Place Order</h1>

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>Shipping</h3>
              <p>
                <strong> Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.postalCode} ,{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Payment Method</h3>
              <p>
                <strong>Method :</strong> {cart.paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3> Order Items</h3>

              {cart.cartItems.length === 0 ? (
                <Message variant="info">Your Cart is Empty </Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((ele) => (
                    <ListGroup.Item>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={ele.image}
                            alt={ele.name}
                            fluid
                            rounded
                          ></Image>
                        </Col>
                        <Col>
                          <Link to={`/products/${ele.product}`}>
                            {ele.name}
                          </Link>
                        </Col>
                        <Col>
                          {ele.qty} X $ {ele.price} = $
                          {(ele.qty * ele.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>ORDER SUMMARY</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>$ {cart.shippingPrice} </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type="button"
                  block
                  disabled={cart.cartItems.length === 0}
                  onClick={handlePlaceorder}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceorderScreen;
