import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  saveOrders,
  getOrderDetails,
  updatePayment,
  getMyOrders,
  getOrdersList,
  updateDelivery,
} from "../controllers/orderController.js";

const router = express.Router();

router.route("/").post(protect, saveOrders).get(protect, admin, getOrdersList);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderDetails);
router.route("/:id/pay").put(protect, updatePayment);
router.route("/:id/deliver").put(protect, admin, updateDelivery);

export default router;
