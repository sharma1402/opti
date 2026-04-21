const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderDetails,
  getWalletBalance
} = require("../controller/order");
const { clientAuth } = require("../middleware/auth");

router.post("/orders", clientAuth, createOrder);
router.get("/orders/:order_id", clientAuth, getOrderDetails);
router.get("/wallet/balance", clientAuth, getWalletBalance);

module.exports = router;