// Initiate the server and connect to the database
const express = require("express");
const server = express();
const port = 3000;
const { request, response } = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { DB_URI } = process.env;
const Product = require("./models/product");

//Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors()); // Enable CORS for all requests to the server (Cross-Origin Resource Sharing) - This is needed to allow the frontend to make requests to the backend server

// Connect to the database
mongoose
  .connect(DB_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database", error.message);
  });

server.get("/products", async (request, response) => {
  try {
    const products = await Product.find();
    response.send(
      products.map(p => ({
        id: p._id,
        productName: p.productName,
        brand: p.brand,
        price: p.price,
        image: p.image,
      }))
    );
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

server.post("/add-product", async (request, response) => {
  const { productName, brand, image, price } = request.body;
  const newProduct = new Product({
    productName,
    brand,
    image,
    price,
  });
  console.log(newProduct);
  try {
    await newProduct.save();
    console.log("Product added successfully");
    response.status(201).json({ 
      message: "Product added successfully",
      id: newProduct._id
    });
  } catch (error) {
    // console.log("Product added unsuccessfully");
    console.error("Product added unsuccessfully:", error);
    response.status(400).json({ message: error.message });
  }
});

server.delete("/products/:id", async (request, response) => {
  const { id } = request.params;
  const objectId = new mongoose.Types.ObjectId(id); // Convert id to Mongoose ObjectId
  try {
    await Product.findByIdAndDelete(objectId);
    response.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
});

server.patch("/products/:id", async (request, response) => {
  const { id } = request.params;
  const { productName, brand, image, price } = request.body;
  const objectId = new mongoose.Types.ObjectId(id); // Convert id to Mongoose ObjectId
  try {
    await Product.findByIdAndUpdate(objectId, {
      productName,
      brand,
      image,
      price,
    }).then((response) => {
      console.log(response);
    });

    await response
      .status(200)
      .json({ message: "Product updated successfully" });
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
});
