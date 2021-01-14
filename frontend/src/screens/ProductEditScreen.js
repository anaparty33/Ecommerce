import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { listProductDetails, updateProduct } from "../actions/productAction.js";
import Loader from "../components/Loader.js";
import Message from "../components/Message.js";
import FormContainer from "../components/FormContainer.js";
import { useDispatch, useSelector } from "react-redux";
import {
  PRODUCT_DETAIL_RESET,
  PRODUCT_UPDATE_RESET,
} from "../constants/productConstant.js";

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id;
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState();
  const [countInStock, setCountInStock] = useState(0);
  const [category, setCategory] = useState();
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, product } = useSelector(
    (state) => state.productDetail
  );

  const {
    loading: loadingUpdate,
    success: successUpdate,
    errorUpdate,
  } = useSelector((state) => state.productUpdate);
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      dispatch({ type: PRODUCT_DETAIL_RESET });
      history.push("/admin/productslist");
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setBrand(product.brand);
        setPrice(product.price);
        setImage(product.image);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, product, productId, successUpdate, history]);

  const fileUploadHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post("/api/upload", formData, config);
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const HandleUpdate = () => {
    dispatch(
      updateProduct({
        _id: productId,
        name: name,
        brand: brand,
        price: price,
        image: image,
        category: category,
        countInStock: countInStock,
        description: description,
      })
    );
  };

  return (
    <>
      <Link to="/admin/productslist">Go Back</Link>
      <FormContainer>
        <h2>Edit product Details</h2>

        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {loading ? (
          <Loader />
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
            <Form.Group>
              <Form.Label>Brand </Form.Label>
              <Form.Control
                value={brand}
                type="name"
                placeholder="Enter Brand"
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>price </Form.Label>
              <Form.Control
                value={price}
                type="number"
                placeholder="Enter Brand"
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>image </Form.Label>
              <Form.Control
                value={image}
                type="text"
                placeholder="Enter Image Path"
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.File
                id="image-file"
                label="choose a file"
                custom
                onChange={fileUploadHandler}
              ></Form.File>
            </Form.Group>
            <Form.Group>
              <Form.Label>description </Form.Label>
              <Form.Control
                value={description}
                type="text"
                placeholder="Enter description"
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>category </Form.Label>
              <Form.Control
                value={category}
                type="text"
                placeholder="Enter Category"
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
              {uploading && <Loader />}
            </Form.Group>
            <Form.Group>
              <Form.Label>countInStock </Form.Label>
              <Form.Control
                value={countInStock}
                type="number"
                placeholder="Enter countinstock"
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button onClick={HandleUpdate}>Update</Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
