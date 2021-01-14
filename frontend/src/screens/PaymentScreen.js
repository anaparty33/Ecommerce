import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer.js";
import { savePaymentMethod } from "../actions/cartAction.js";
import CheckoutSteps from "../components/CheckoutSteps.js";

const PaymentScreen = ({ history }) => {
  const { shippingAddress } = useSelector((state) => state.cart);

  if (!shippingAddress) {
    history.push("/shipping");
  }

  const [paymentMethod, setPaymentMethod] = useState("paypal");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>payment details</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="payment">
          <Form.Label as="legend">Payment Method </Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="Paypal or Credit Card"
              name="payment"
              value="Paypal"
              checked
              onChange={(e) => e.target.value}
            />
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">
          Continue{" "}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
