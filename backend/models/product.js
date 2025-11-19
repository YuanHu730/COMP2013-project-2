// Initialize mongoose
const mongoose = require("mongoose");
// Define the schema for the contact model
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
});
// Create the model for the product schema
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
