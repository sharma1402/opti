const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");
const Ledger = require("../models/Ledger");
const Order = require("../models/Order");
const callFulfillmentAPI = require("../utils/fulfillment");

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const client_id = req.clientId;
    const { amount } = req.body;

    if (amount == null || amount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const wallet = await Wallet.findOne({ client_id }).session(session);

    if (!wallet) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet.balance < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    wallet.balance -= amount;
    await wallet.save({ session });

    await Ledger.create(
      [
        {
          client_id,
          type: "debit",
          amount,
          balance_after: wallet.balance,
          note: "Order created"
        }
      ],
      { session }
    );

    const order = await Order.create(
      [
        {
          client_id,
          amount,
          status: "created"
        }
      ],
      { session }
    );

    const createdOrder = order[0];

    const fulfillmentId = await callFulfillmentAPI(client_id, createdOrder._id.toString());

    createdOrder.fulfillment_id = fulfillmentId.toString();
    await createdOrder.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Order created successfully",
      order: createdOrder
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      message: "Order creation failed",
      error: error.message
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const client_id = req.clientId;
    const { order_id } = req.params;

    const order = await Order.findOne({ _id: order_id, client_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getWalletBalance = async (req, res) => {
  try {
    const client_id = req.clientId;

    const wallet = await Wallet.findOne({ client_id });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    return res.status(200).json({
      client_id,
      balance: wallet.balance
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrderDetails, getWalletBalance };