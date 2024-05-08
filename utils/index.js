const ProductModel = require("../model/ProductModel");

// To Calculate Total Price
const calculateTotalPrice = (products, cartItems) => {
  let totalPrice = 0;

  cartItems.forEach(function (cartItem) {
    const product = products.find(function (product) {
      return product._id?.toString() === cartItem._id;
    });

    if (product) {
      const quantity = cartItem.cartQuantity;
      const price = parseFloat(product.discountedPrice);
      totalPrice += quantity * price;
    }
  });

  return totalPrice * 100;
};

const updateProductQuantity = async (cartItems) => {
  let bulkOption = cartItems.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: {
          $inc: {
            quantity: -product.cartQuantity,
            sold: +product.cartQuantity,
          },
        },
      },
    };
  });
  await ProductModel.bulkWrite(bulkOption, {});
};

module.exports = { calculateTotalPrice, updateProductQuantity };
