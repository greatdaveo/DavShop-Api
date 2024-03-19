const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
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
  },

  { timestamps: true }
);

const CategoryModel = mongoose.model("category", categorySchema);

module.exports = CategoryModel;
