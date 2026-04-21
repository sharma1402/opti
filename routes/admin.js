const express = require("express");
const router = express.Router();
const { creditWallet, debitWallet } = require("../controller/admin");
const { adminAuth } = require("../middleware/auth");

router.post("/wallet/credit", adminAuth, creditWallet);
router.post("/wallet/debit", adminAuth, debitWallet);

module.exports = router;