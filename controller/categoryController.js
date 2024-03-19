const asyncHandler = require("express-async-handler");
const CategoryModel = require("../model/CategoryModel");
const { default: slugify } = require("slugify");

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Please fill the category name!");
  }

  //   To check if the category name exist in the database
  const existingCategory = await CategoryModel.findOne({ name });

  if (existingCategory) {
    res.status(400);
    throw new Error("Category name already exist!");
  }

  const createdCategory = await CategoryModel.create({
    name,
    slug: slugify(name),
  });

  res.status(201).json(createdCategory);
});

module.exports = { createCategory };
