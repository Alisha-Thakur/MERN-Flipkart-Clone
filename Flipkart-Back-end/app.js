require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const { USER_ROUTES } = require("./server/routes");

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

console.log("db", MONGODB_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", USER_ROUTES);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => console.log("ERR: ", err));
