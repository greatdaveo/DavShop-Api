const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/ProductRoute");
const categoryRoute = require("./routes/categoryRoute");
const brandRoute = require("./routes/brandRoute");
const couponRoute = require("./routes/couponRoute");
const orderRoute = require("./routes/orderRoute");
const errorHandler = require("./Middleware/errorHandler");
// For Firebase Auth
const firebaseAdmin = require("firebase-admin");
// const serviceAccountKey = require("./serviceAccountKey.json");
const serviceAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// For Firebase
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccountKey),
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dee-shop-online-store.vercel.app",
    ],
    credentials: true,
  })
);

// Error Middleware
app.use(errorHandler);

// User Route
app.use("/api/user", userRoute);
app.use("/api/products", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/brand", brandRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/order", orderRoute);

app.get("/test", (req, res) => {
  res.send("API Testing!!!");
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}!!!`);
    });
  })
  .catch((err) => console.log(err));
