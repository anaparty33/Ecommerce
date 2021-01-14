import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

const SearchBox = ({ history }) => {
  const [keyword, setkeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(keyword);
    if (keyword) {
      history.push(`/search/${keyword}`);
    } else {
      history.push("/");
    }
  };

  return (
    <Form inline onSubmit={submitHandler}>
      <Form.Control
        value={keyword}
        type="text"
        placeholder="Search"
        className="mr-sm-2"
        onChange={(e) => setkeyword(e.target.value)}
      ></Form.Control>{" "}
      <Button type="submit" variant="outline-success">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
