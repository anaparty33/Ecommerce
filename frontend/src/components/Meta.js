import React from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome to Myshop",
  description: "We sell products electronics for cheap",
  keywords: "Electronics, Cheap Electronics",
};
export default Meta;
