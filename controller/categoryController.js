const asyncHandler = require("express-async-handler");
const CategoryModel = require("../model/CategoryModel");
const { default: slugify } = require("slugify");

// To create a category for some products
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

  //   To create a Category
  const createdCategory = await CategoryModel.create({
    name,
    slug: slugify(name),
  });

  res.status(201).json(createdCategory);
});

//  To get all the Categories
const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await CategoryModel.find().sort("-createdAt");
  res.status(200).json(categories);
});

module.exports = { createCategory, getAllCategory };
