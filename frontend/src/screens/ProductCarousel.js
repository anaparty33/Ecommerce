import React, { useEffect } from "react";
import { Carousel, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { topRatedProductsList } from "../actions/productAction.js";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProductCarousel = () => {
  const dispatch = useDispatch();

  const { loading, products, error, success } = useSelector(
    (state) => state.topRatedProducts
  );

  useEffect(() => {
    dispatch(topRatedProductsList());
  }, [dispatch]);
  return loading ? (
    <Loader />
  ) : error ? (
    <Message> {error}</Message>
  ) : (
    <div>
      <Carousel onPause="hover" className="bg-dark">
        {products.map((product) => (
          <Carousel.Item key={product._id}>
            <Link to={`products/${product._id}`}>
              <Image src={product.image} alt={product.name} fluid></Image>
            </Link>
            <Carousel.Caption>
              <Link to={`products/${product._id}`}>
                <h2>
                  {product.name} ({product.price})
                </h2>
              </Link>
              <p></p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
