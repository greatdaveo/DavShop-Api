const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("../api/routes/userRoute");
const errorHandler = require("../api/Middleware/errorHandler");

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:5173/", "http://dee-shop.vercel.app"],
    credentials: true,
  })
);
// Error Middleware
app.use(errorHandler);

// Registration Route
app.use("/api/user", userRoute);

app.get("/test", (req, res) => {
  res.send("API Testing!!!");
});



const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port 3000! ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
