const express = require("express");
const router = express.Router();
//Import controller functions
const { createOrder, getOrderDetails, getWalletBalance } = require("../controller/order");
//Import client auth middleware
const { clientAuth } = require("../middleware/auth");

// client routes
router.post("/orders", clientAuth, createOrder); //create a order
router.get("/orders/:order_id", clientAuth, getOrderDetails); //get order detail
router.get("/wallet/balance", clientAuth, getWalletBalance); //get wallet balance

module.exports = router;