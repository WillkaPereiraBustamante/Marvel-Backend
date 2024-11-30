require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const app = express();
const axios = require("axios");
const cors = require("cors");

app.use(cors());

app.use(express.json());

const routes = require("./routes/index");
app.use("/", routes);

mongoose.connect(process.env.MONGODB_URI);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.get("/", (req, res) => {
  try {
    return res.status(200).json("Bienvenue sur le serveur Marvel");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  return res.status(404).json("Not found");
});

// Mon serveur va écouter le port 3000
const PORT = 4000;

app.listen(process.env.PORT || PORT, () => {
  console.log("Server started 🚀");
});
