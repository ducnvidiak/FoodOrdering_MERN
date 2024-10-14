import express from "express";
import {
  listOrders,
  placeOrder,
  updateOrderStatus,
  userOrder,
  verifyOrder,
} from "../controllers/order.controller.js";

import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// router.get("/", authMiddleware, getOrders);
router.post("/place", authMiddleware, placeOrder);
router.post("/verify", verifyOrder);
router.get("/user-orders", authMiddleware, userOrder);
router.get("/list", listOrders);
router.put("/status", updateOrderStatus);

// router.put("/:id", authMiddleware, updateOrder);
// router.delete("/:id", authMiddleware, deleteOrder);

export default router;
