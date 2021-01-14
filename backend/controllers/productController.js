import Product from "../models/productmodel.js";
import asyncHandler from "express-async-handler";

// @desc  Fetch all products
// @route GET /api/products
// @access Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageLimit = 10;
  const pageNumber = Number(req.query.pageNumber) || 1;
  const searchItem = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  const count = await Product.countDocuments({ ...searchItem });
  const products = await Product.find({ ...searchItem })
    .limit(pageLimit)
    .skip((pageNumber - 1) * pageLimit);

  res.json({ products, pageNumber, pages: Math.ceil(count / pageLimit) });

  console.log(products.length);
});

// @desc  Fetch single product
// @route GET /api/products/:id
// @access Public
export const getProductsById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("product not found");
  }
});
// @ delete product
// DELETE /api/products/:id
// Private/admin

export const deleteProduct = asyncHandler(async (req, res) => {
  const productID = req.params.id;

  const product = await Product.findById(productID);

  if (product) {
    product.remove();
    res.send({ message: "product deleted" });
  } else {
    res.status(404);
    throw new Error("product not found");
  }
});
// CREATE PRODUCT
// POST api/products
// private /admin

export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "sample name",
    user: req.user._id,
    price: 10,
    brand: "smaple Brand",
    rating: 0,
    numReviews: 0,
    category: "sample category",
    countInStock: 0,
    description: "sample decsription",
    image: "/images/sample.jpg",
  });

  const createdProdcut = await product.save();

  if (createdProdcut) {
    res.status(201).json(createdProdcut);
  } else {
    res.status(404);
    throw new Error("unable to create a product");
  }
});

// UPDATE PRODUCT
// PUT api/products/:id
// private/ admin

export const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  const {
    name,
    price,
    brand,
    description,
    image,
    countInStock,
    // rating,
    category,
    // numReviews,
  } = req.body;

  const product = await Product.findById(productId);

  if (product) {
    (product.name = name),
      (product.price = price),
      (product.brand = brand),
      (product.description = description),
      (product.image = image),
      (product.countInStock = countInStock),
      // (product.rating = rating),
      (product.category = category);
    // (product.numReviews = numReviews);

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("product no found");
  }
});

// @ POST api/product/:id/reviews
// Private
// Create a product review

export const createProductReview = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  const { rating, comment } = req.body;

  const product = await Product.findById(productId);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(401);
      throw new Error("product already reviewd");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment: comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json("review added");
  } else {
    res.status(401);
    throw new Error("product not found");
  }
});
// GET /api/top
// Public
// getting top rated products

export const topRatedProducts = asyncHandler(async (req, res) => {
  const topRatedProducts = await Product.find({}).sort({ rating: -1 }).limit(3);

  if (topRatedProducts) {
    res.json(topRatedProducts);
  } else {
    res.status("401");
    throw new Error("no top rated products");
  }
});
