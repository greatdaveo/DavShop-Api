const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add a name!"],
      trim: true,
    },

    // sku - Store Keeping Unit
    sku: {
      type: String,
      required: true,
      default: "SKU",
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Please add a category!"],
      trim: true,
    },

    brand: {
      type: String,
      required: [true, "Please add a brand!"],
      trim: true,
    },

    color: {
      type: String,
      required: [true, "Please add a color!"],
      trim: true,
    },

    quantity: {
      type: Number,
      required: [true, "Please add a quantity!"],
      trim: true,
    },

    sold: {
      type: Number,
      default: 0,
      trim: true,
    },

    regularPrice: {
      type: Number,
      trim: true,
    },

    discountedPrice: {
      type: Number,
      required: [true, "Please add a price!"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Please add a description!"],
      trim: true,
    },

    image: {
      type: String,
    },

    ratings: {
      type: [Object],
    },
  },

  { timestamps: true }
);

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
