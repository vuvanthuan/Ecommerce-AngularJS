const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    image: String,
    dimensions: {
      height: { type: Number, default: 0 },
      diameter: { type: Number, default: 0 },
    },
    designInfo: {
      designer: { type: String, default: "N/A" },
      location: { type: String, default: "N/A" },
    },
    material: { type: String, default: "N/A" },
    glazeColor: { type: String, default: "N/A" },
    productCode: { type: String, default: "N/A" },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    tags: [String],
    quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
