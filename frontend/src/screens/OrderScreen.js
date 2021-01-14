import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Col, Row, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButton } from "react-paypal-button-v2";

import CheckoutSteps from "../components/CheckoutSteps.js";
import Message from "../components/Message.js";
import Loader from "../components/Loader.js";

import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderAction.js";
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from "../constants/orderConstants.js";

const OrderScreen = ({ match, history }) => {
  const id = match.params.id;

  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);

  const { loading, success, order, error } = useSelector(
    (state) => state.orderDetails
  );

  const { loading: loadingPay, success: successPay } = useSelector(
    (state) => state.updatePayment
  );

  const { loading: loadingDelivery, success: successDelivery } = useSelector(
    (state) => state.updateDelivered
  );

  const { userInfo } = useSelector((state) => state.userLogin);
  if (!loading) {
    order.itemsPrice = order.orderItems.reduce(
      (acc, item) => item.price * item.qty + acc,
      0
    );
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }
    const addPaypalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || order._id !== id || successPay || successDelivery) {
      dispatch({ type: ORDER_PAY_RESET }); // prevent infinite loop or loading after payment
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(id));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPaypalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, id, successPay, order, successDelivery]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(id, paymentResult));
  };

  const deliveryHandler = (order) => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>Shipping</h3>

              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong> Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode} ,{" "}
                {order.shippingAddress.country}
              </p>
              <p>
                {order.isDelivered ? (
                  <Message variant="success">Delivered</Message>
                ) : (
                  <Message variant="danger">Not Delivered</Message>
                )}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Payment Method</h3>
              <p>
                <strong>Method :</strong> {order.paymentMethod}
              </p>

              <p>
                <strong>Status:</strong>

                {order.isPaid ? (
                  <Message variant="success">Paid</Message>
                ) : (
                  <Message variant="danger">Not paid</Message>
                )}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3> Order Items</h3>

              {order.orderItems.length === 0 ? (
                <Message variant="info">Your Cart is Empty </Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((ele) => (
                    <ListGroup.Item key={ele.name}>
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
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>$ {order.shippingPrice} </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
              {userInfo && userInfo.isAdmin && order.isPaid && (
                <ListGroup.Item>
                  <Button
                    className="btn-block"
                    onClick={() => deliveryHandler(order)}
                  >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
