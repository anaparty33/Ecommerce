import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  ListGroup,
  Image,
  Form,
  Button,
} from "react-bootstrap";
import Message from "../components/Message.js";

import { addToCart, removeCart } from "../actions/cartAction.js";
import { Link } from "react-router-dom";

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split("=")[1]) : "1";

  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  console.log(cartItems);

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, match, qty]);
  const removeFromCartHandler = (id) => {
    dispatch(removeCart(id));
  };
  const checkoutHandler = () => {
    history.push("/login?redirect=shipping");
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            {" "}
            Your Cart is empty 🙁....<Link to="/">
              Click Here to Home Page
            </Link>{" "}
          </Message>
        ) : (
          <ListGroup variant="flush">
            {console.log(cartItems)}

            {cartItems.map((product) => (
              <ListGroup.Item key={product.product}>
                <Row>
                  <Col md={2}>
                    <Image src={product.image} fluid rounded></Image>
                  </Col>
                  <Col md={3}>
                    <Link to={`/products/${product.product}`}>
                      {product.name}
                    </Link>
                  </Col>
                  <Col md={2}>$ {product.price}</Col>
                  <Col>
                    {" "}
                    <Form.Control
                      as="select"
                      onChange={(e) =>
                        dispatch(
                          addToCart(product.product, Number(e.target.value))
                        )
                      }
                      value={product.qty}
                    >
                      {[...Array(product.countInStock).keys()].map((ele) => {
                        return (
                          <option key={ele + 1} value={ele + 1}>
                            {ele + 1}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Col>
                  <Col>
                    <Button
                      type="button "
                      variant="light"
                      onClick={() => {
                        removeFromCartHandler(product.product);
                      }}
                    >
                      <i class="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal {cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
                items
              </h2>
              total price: ${" "}
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={() => checkoutHandler()}
              >
                {" "}
                Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
      <Col></Col>
    </Row>
  );
};

export default CartScreen;
