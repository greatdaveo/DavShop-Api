const asyncHandler = require("express-async-handler");
const BrandModel = require("../model/BrandModel");
const { default: slugify } = require("slugify");
const CategoryModel = require("../model/CategoryModel");

// To create a brand for some products categories
const createBrand = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  if (!name || !category) {
    res.status(400);
    throw new Error("Please fill the all fields!");
  }

  //   To check if the brand category name exist in the Category database
  const existingCategory = await CategoryModel.findOne({ name: category });

  if (!existingCategory) {
    res.status(400);
    throw new Error("Parent category not found!");
  }

  //   To create a Brand for the existing Category
  const createdBrand = await BrandModel.create({
    name,
    slug: slugify(name),
    category,
  });

  res.status(201).json(createdBrand);
});

//  To get all the Brands
const getAllBrand = asyncHandler(async (req, res) => {
  const brands = await BrandModel.find().sort("-createdAt");
  res.status(200).json(brands);
});

// To Delete a Brand
const deleteBrand = asyncHandler(async (req, res) => {
  // Tp delete the brand base on the slug and not the name
  const slug = req.params.slug.toLowerCase();
  const brand = await BrandModel.findOneAndDelete({ slug });

  if (!brand) {
    res.status(400);
    throw new Error("Brand name not found!");
  }

  res.status(200).json({ message: "Brand has been deleted!" });
});

module.exports = { createBrand, getAllBrand, deleteBrand };
