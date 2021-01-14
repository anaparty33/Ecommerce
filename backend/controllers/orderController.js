import Order from "../models/ordermodel.js";
import asyncHandler from "express-async-handler";

// @route /api/orders
// @protected
// @ POST /api/orders

export const saveOrders = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No added items in cart");
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @ GET api/orders/:id
// private get order details from database
// check populate function

export const getOrderDetails = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("unable to find order with details");
  }
});

export const updatePayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    (order.isPaid = "true"),
      ((order.isPaidAt = Date.now()),
      (order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      }));

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("unable to find order with details");
  }
});

// @ get orders of particular user
// @ GET api/orders/myorders
// @ private

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  res.json(orders);
});

// @  GET  api/orders
// @Pprivate
// GET all the orders to admin
export const getOrdersList = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "_id name");

  if (orders) {
    res.json(orders);
  } else {
    res.status(404).json("NO ORDERS FOUND");
  }
});

//@ PUT api/orders/id/deliver
// Update the order to Delivered
// @Private Admin

export const updateDelivery = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = "true";

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("order not found");
  }
});
