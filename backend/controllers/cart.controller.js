import User from "../models/user.model.js";

export const addToCart = async (req, res) => {
  const { userId, itemId } = req.body;
  try {
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = await userData.cartData;

    if (!cartData[req.body.itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await User.findByIdAndUpdate(userId, {
      cartData: cartData,
    });
    res.status(200).json({
      success: true,
      message: "Item added to cart",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { userId, itemId } = req.body;
  try {
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = userData.cartData;

    if (!cartData[itemId]) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }
    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
    }

    await User.findByIdAndUpdate(userId, {
      cartData,
    });
    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCart = async (req, res) => {
  const { userId } = req.body;
  try {
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const cartData = userData.cartData;
    res.status(200).json({
      success: true,
      cartData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
