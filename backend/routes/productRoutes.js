const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.js");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getRelatedProducts
} = require("../controllers/productController");

router.post("/", upload.single("image"), createProduct);
router.get("/", getProducts);
router.get("/related", getRelatedProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
