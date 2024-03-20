const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: "Name is required",
      minlength: [2, "Text is too short!"],
      maxlength: [32, "Text is too long!"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

const BrandModel = mongoose.model("brand", brandSchema);

module.exports = BrandModel;
