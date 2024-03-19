const asyncHandler = require("express-async-handler");
const ProductModel = require("../model/ProductModel");

// To create product
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

// To Get all the Products from the database
const getAllProducts = asyncHandler(async (req, res) => {
  const allProducts = await ProductModel.find().sort("-createdAt");
  res.status(200).json(allProducts);
});

// To Get Single Product from the database
const getSingleProduct = asyncHandler(async (req, res) => {
  const singleProduct = await ProductModel.findById(req.params.id);

  if (!singleProduct) {
    res.status(404);
    throw new Error("Products not found!");
  }

  //   To send the product to the user
  res.status(200).json(singleProduct);
});

// To Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found!");
  }

  //   To delete the product
  await ProductModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Product deleted successfully!" });
});

// To Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
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

  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found!");
  }

  //  To update
  const updatedProduct = await ProductModel.findByIdAndUpdate(
    { _id: req.params.id },

    {
      name,
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
    },

    { new: true, runValidators: true }
  );

  res.status(200).json(updatedProduct);
});

// To make the user review products
const reviewProduct = asyncHandler(async (req, res) => {
  const { star, reviewComment, reviewDate } = req.body;
  const { id } = req.params;

  //   To validate the user
  if (star < 1 || !reviewComment) {
    res.status(400);
    throw new Error("Please add ratings and review");
  }

  const reviewedProduct = await ProductModel.findById(id);

  if (!reviewedProduct) {
    res.status(404);
    throw new Error("Product not found!");
  }

  //   To update the Ratings Array Object
  reviewedProduct.ratings.push({
    star,
    reviewComment,
    reviewDate,
    name: req.user.name,
    userId: id,
  });

  reviewedProduct.save();

  res.status(200).json({ message: "Product review has been added!" });
});

// To Delete Review
const deleteReview = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found!");
  }

  const newRatings = product.ratings.filter((rating) => {
    return rating.userId.toString() !== userId.toString();
  });

  product.ratings = newRatings;
  product.save();
  res.status(200).json({ message: "Product review deleted!" });
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  reviewProduct,
  deleteReview,
};
