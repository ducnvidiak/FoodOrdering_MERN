import Food from "../models/food.model.js";

import fs from "fs";

const addFood = async (req, res) => {
  const image_filename = req.file.filename;
  const { name, description, image, price, category } = req.body;
  const newFood = new Food({
    name,
    description,
    image: image_filename,
    price,
    category,
  });

  try {
    await newFood.save();
    res.status(201).json({ newFood, success: true, message: "Food Added" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await Food.findById(req.body.id);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    }

    fs.unlinkSync(`uploads/${food.image}`);
    await Food.findByIdAndDelete(req.body.id);

    res.status(200).json({ success: true, message: "Food deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFoodList = async (req, res) => {
  try {
    const food = await Food.find({});
    res.status(200).json({ success: true, food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addFood, removeFood, getFoodList };
