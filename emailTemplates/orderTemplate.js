const orderSuccessEmail = (name, cartItems) => {
  // To form the structure of the Email
  const email = {
    body: {
      name: name,
      intro: "Your order has been placed successfully!",
      table: {
        data: cartItems.map((item) => {
          return {
            product: item.name,
            price: item.discountedPrice,
            quantity: item.cartQuantity,
            total: item.discountedPrice * item.cartQuantity,
          };
        }),
        columns: {
          customWidth: {
            product: "40%",
          },
        },
      },
      action: {
        instructions:
          "Kindly check the status of your order and more info in your dashboard.",
        button: {
          color: "#ffd700",
          text: "Go to Dashboard",
          link: "http://dee-shop.vercel.app",
        },
      },
      outro:
        "Thank you for you purchase, and we look forward to seeing you again!",
    },
  };
  return email;
};

module.exports = {
  orderSuccessEmail,
};
