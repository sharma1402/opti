const Wallet = require("../models/Wallet");
const Ledger = require("../models/Ledger");
// Admin controller functions
const creditWallet = async (req, res) => {
  try {
    const { client_id, amount } = req.body;
    if (!client_id || amount == null) {
      return res.status(400).json({ message: "client_id and amount are required" });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount greater than 0" });
    }

    let wallet = await Wallet.findOne({ client_id });
    if (!wallet) {
      wallet = await Wallet.create({ client_id, balance: 0 });
    }
    wallet.balance += amount; //credit wallet
    await wallet.save();

    await Ledger.create({ //create ledger entry
      client_id,
      type: "credit",
      amount,
      balance_after: wallet.balance, 
      note: "Admin credited wallet"
    });
    return res.status(200).json({
      message: "Wallet credited successfully",
      client_id,
      balance: wallet.balance
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const debitWallet = async (req, res) => {
  try {
    const { client_id, amount } = req.body;
    if (!client_id || amount == null) {
      return res.status(400).json({ message: "client_id and amount are required" });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }
    const wallet = await Wallet.findOne({ client_id });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    wallet.balance -= amount;
    await wallet.save();
    await Ledger.create({
      client_id,
      type: "debit",
      amount,
      balance_after: wallet.balance,
      note: "Admin debited wallet"
    });

    return res.status(200).json({
      message: "Wallet debited successfully",
      client_id,
      balance: wallet.balance
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { creditWallet, debitWallet };