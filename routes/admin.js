const express = require("express");
const router = express.Router();
const { creditWallet, debitWallet } = require("../controller/admin");
const { adminAuth } = require("../middleware/auth");
// Admin routes
router.post("/wallet/credit", adminAuth, creditWallet); // credit wallet
router.post("/wallet/debit", adminAuth, debitWallet); // debit wallet

module.exports = router;