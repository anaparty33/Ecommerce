import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { getUserDetails, userUpdateAdmin } from "../actions/userAction.js";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message.js";
import Loader from "../components/Loader.js";
import FormContainer from "../components/FormContainer.js";
import { USER_UPDATE_RESET } from "../constants/userConstants.js";

const UserEditScreen = ({ match, history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.userDetails);
  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
  } = useSelector((state) => state.userUpdate);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      history.push("/admin/userslist");
    } else {
      if (!user.name || match.params.id !== user._id) {
        dispatch(getUserDetails(match.params.id));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, user, successUpdate, history]);

  const HandleUpdate = (e) => {
    e.preventDefault();
    dispatch(
      userUpdateAdmin({
        _id: match.params.id,
        name: name,
        email: email,
        isAdmin: isAdmin,
      })
    );
  };

  return (
    <>
      <Link to="/admin/userslist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h2>{`Edit ${name} Details`}</h2>
        {loadingUpdate && <Loader></Loader>}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {loading ? (
          <Loader></Loader>
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form>
            <Form.Group>
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
              <Form.Check
                type="checkbox"
                label="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button onClick={(e) => HandleUpdate(e)}>Update</Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
