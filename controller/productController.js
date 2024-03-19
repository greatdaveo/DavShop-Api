const asyncHandler = require("express-async-handler");
const ProductModel = require("../model/ProductModel");

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    category,
    brand,
    color,
    quantity,
    sold,
    regularPrice,
    discountedPrice,
    description,
    image,
    ratings,
  } = req.body;

  if (!name || !brand || !category || !quantity || !discountedPrice) {
    res.status(400);
    throw new Error("Please fill in all required fields!");
  }

  //   To create the product
  const createdProduct = await ProductModel.create({
    name,
    sku,
    category,
    brand,
    color,
    quantity,
    sold,
    regularPrice,
    discountedPrice,
    description,
    image,
    ratings,
  });

  res.status(201).json(createdProduct);
});

module.exports = {
  createProduct,
};
