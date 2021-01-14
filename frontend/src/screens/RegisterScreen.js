import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import { register } from "../actions/userAction.js";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer.js";
import Message from "../components/Message.js";
import Loader from "../components/Loader.js";

const LoginScreen = ({ location, history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const redirect = location.search ? location.search.split("=")[1] : "/";
  const dispatch = useDispatch();
  const { loading, error, userInfo } = useSelector(
    (state) => state.userRegister
  );

  useEffect(() => {
    if (userInfo) {
      console.log(userInfo);
      console.log("inside useffect");
      history.push(redirect);
    }
  }, [userInfo, history, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch register action
    if (password !== confirmPassword) {
      setMessage("password does not match");
    } else {
      dispatch(register(name, email, password));
    }
  };

  return (
    <FormContainer>
      <h1>Register</h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Name </Form.Label>
          <Form.Control
            value={name}
            type="name"
            placeholder="Enter name"
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email </Form.Label>
          <Form.Control
            value={email}
            type="email"
            placeholder="Enter email address"
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label> Password</Form.Label>
          <Form.Control
            value={password}
            type="password"
            placeholder="Enter passowrd"
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label> Confirm Password</Form.Label>
          <Form.Control
            value={confirmPassword}
            type="password"
            placeholder="Re-enter passowrd"
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Register
        </Button>

        <Row className="py-3">
          <Col>
            Already exists ?{" "}
            <Link to={redirect ? `login?redirect=${redirect}` : "/login"}>
              {" "}
              Login{" "}
            </Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default LoginScreen;
