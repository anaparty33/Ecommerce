import React, { useEffect } from "react";
import Loader from "../components/Loader.js";
import Message from "../components/Message.js";
import { Table, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersList } from "../actions/orderAction.js";
import { green, red } from "colors";
import { LinkContainer } from "react-router-bootstrap";

const OrdersListScreen = ({ history }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userLogin);
  const ordersList = useSelector((state) => state.ordersList);
  const { loading, orders, error } = ordersList;

  useEffect(() => {
    if (!userInfo && !userInfo.isAdmin) {
      history.push("/login");
    } else {
      dispatch(getOrdersList());
    }
  }, [history, userInfo]);

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>Delivered</th>
              <th>Paid</th>
              <th>Total Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>

                <td>
                  {order.isDelivered ? (
                    <i
                      style={{ color: "green" }}
                      className="fas fa-check-circle"
                    ></i>
                  ) : (
                    <i
                      style={{ color: "red" }}
                      className="far fa-times-circle"
                    ></i>
                  )}
                </td>
                <td>
                  {order.isPaid ? (
                    <i
                      style={{ color: "green" }}
                      className="fas fa-check-circle"
                    ></i>
                  ) : (
                    <i
                      style={{ color: "red" }}
                      className="far fa-times-circle"
                    ></i>
                  )}
                </td>
                <td>{order.totalPrice}</td>
                <LinkContainer to={`/order/${order._id}`}>
                  <Button variant="light" className="btn-sm">
                    <td>Details</td>
                  </Button>
                </LinkContainer>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrdersListScreen;
