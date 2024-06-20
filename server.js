const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const transactionRoute = require("./routes/transactionRoute");
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
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: [
      "https://davshop-online-store.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// Transaction routes
app.use("/api/wallet", transactionRoute);
// Middlewares
app.use(express.json());

// For Firebase
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccountKey),
});

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
