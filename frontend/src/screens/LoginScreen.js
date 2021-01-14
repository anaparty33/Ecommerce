import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import { login } from "../actions/userAction.js";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer.js";
import Message from "../components/Message.js";
import Loader from "../components/Loader.js";

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const redirect = location.search ? location.search.split("=")[1] : "/";
  const dispatch = useDispatch();
  const { loading, error, userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (userInfo) {
      console.log(userInfo);
      console.log("inside useffect");
      history.push(redirect);
    }
  }, [userInfo, history, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch login action

    dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <h1 className="my-3">sign in</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
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

        <Button type="submit" variant="primary">
          Sign in
        </Button>

        <Row className="py-3">
          <Col>
            New Customer ?{" "}
            <Link to={redirect ? `register?redirect=${redirect}` : "/register"}>
              {" "}
              Register{" "}
            </Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default LoginScreen;
