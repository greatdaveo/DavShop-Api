const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

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
