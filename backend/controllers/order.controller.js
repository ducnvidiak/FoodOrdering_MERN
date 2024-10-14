import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Stripe from "stripe";

export const placeOrder = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const newOrder = new Order({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await User.findByIdAndUpdate(req.body.userId, {
      cartData: {},
    });
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charge",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_CLIENT_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.FRONTEND_CLIENT_URL}/verify?success=false&orderId=${newOrder._id}`,
    });
    res.status(201).json({
      success: true,
      session_url: session.url,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOrder = async (req, res) => {
  const { success, orderId } = req.body;
  try {
    if (success == "true") {
      await Order.findByIdAndUpdate(orderId, {
        payment: true,
      });
      res
        .status(200)
        .json({ success: true, message: "Order paid successfully" });
    } else {
      await Order.findByIdAndDelete(orderId);
      res.status(200).json({ success: false, message: "Order not paid" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userOrder = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.body.userId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.body.orderId);
    if (order) {
      await Order.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
      });
      res.status(200).json({ success: true, message: "Order updated" });
    } else {
      res.status(404).json({ success: false, message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
