const Product = require("../models/product");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      height,
      diameter,
      designer,
      location,
      material,
      glazeColor,
      productCode,
      categories,
      image,
      tags,
      quantity,
      dimensions, // Lấy dimensions nếu có
      designInfo, // Lấy designInfo nếu có
    } = req.body;

    // Xử lý dimensions
    const parsedHeight =
      dimensions?.height !== undefined ? dimensions.height : height;
    const parsedDiameter =
      dimensions?.diameter !== undefined ? dimensions.diameter : diameter;
    const finalHeight =
      parsedHeight === "N/A" || isNaN(parseFloat(parsedHeight))
        ? 0
        : parseFloat(parsedHeight);
    const finalDiameter =
      parsedDiameter === "N/A" || isNaN(parseFloat(parsedDiameter))
        ? 0
        : parseFloat(parsedDiameter);

    // Xử lý designInfo
    const parsedDesigner =
      designInfo?.designer !== undefined ? designInfo.designer : designer;
    const parsedLocation =
      designInfo?.location !== undefined ? designInfo.location : location;
    const finalDesigner =
      parsedDesigner === undefined || parsedDesigner === null
        ? "N/A"
        : String(parsedDesigner);
    const finalLocation =
      parsedLocation === undefined || parsedLocation === null
        ? "N/A"
        : String(parsedLocation);

    const product = new Product({
      name,
      price: parseFloat(price) || 0,
      description,
      image,
      dimensions: { height: finalHeight, diameter: finalDiameter },
      designInfo: { designer: finalDesigner, location: finalLocation },
      material,
      glazeColor,
      productCode,
      categories,
      tags:
        tags && typeof tags === "string"
          ? tags.split(",").map((tag) => tag.trim())
          : [],
      quantity: parseInt(quantity) || 0,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query; // Lấy category từ query parameter

    // Xây dựng query
    let query = {};
    if (category) {
      // Kiểm tra xem category có phải là ObjectId hợp lệ không
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ error: "Category ID không hợp lệ." });
      }
      query.categories = category; // Lọc sản phẩm theo category _id
    }

    // Tìm sản phẩm với query đã xây dựng
    const products = await Product.find(query).populate("categories", "name");
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm nào." });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      description,
      height,
      diameter,
      designer,
      location,
      material,
      glazeColor,
      productCode,
      categories,
      tags,
      image,
      quantity,
      dimensions, // Lấy dimensions nếu có
      designInfo, // Lấy designInfo nếu có
    } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại." });
    }

    // Cập nhật thông tin sản phẩm
    if (name) product.name = name;
    if (price !== undefined) product.price = parseFloat(price) || 0;
    if (description) product.description = description;

    // Xử lý dimensions
    product.dimensions = product.dimensions || {};
    const parsedHeight =
      dimensions?.height !== undefined ? dimensions.height : height;
    const parsedDiameter =
      dimensions?.diameter !== undefined ? dimensions.diameter : diameter;
    if (parsedHeight !== undefined) {
      product.dimensions.height =
        parsedHeight === "N/A" || isNaN(parseFloat(parsedHeight))
          ? 0
          : parseFloat(parsedHeight);
    }
    if (parsedDiameter !== undefined) {
      product.dimensions.diameter =
        parsedDiameter === "N/A" || isNaN(parseFloat(parsedDiameter))
          ? 0
          : parseFloat(parsedDiameter);
    }

    // Xử lý designInfo
    product.designInfo = product.designInfo || {};
    const parsedDesigner =
      designInfo?.designer !== undefined ? designInfo.designer : designer;
    const parsedLocation =
      designInfo?.location !== undefined ? designInfo.location : location;
    if (parsedDesigner !== undefined) {
      product.designInfo.designer =
        parsedDesigner === null ? "N/A" : String(parsedDesigner);
    }
    if (parsedLocation !== undefined) {
      product.designInfo.location =
        parsedLocation === null ? "N/A" : String(parsedLocation);
    }

    if (material) product.material = material;
    if (glazeColor) product.glazeColor = glazeColor;
    if (productCode) product.productCode = productCode;
    if (categories) product.categories = categories;
    if (tags && typeof tags === "string")
      product.tags = tags.split(",").map((tag) => tag.trim());
    if (quantity !== undefined) product.quantity = parseInt(quantity) || 0;
    if (image) product.image = image;

    // Nếu có upload ảnh mới
    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join(__dirname, "..", product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      product.image = `/public/images/${req.file.filename}`;
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại." });
    }

    // Xóa ảnh nếu có
    if (product.image) {
      const imagePath = path.join(__dirname, "..", product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Sản phẩm đã được xóa thành công." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    // Lấy các query parameters
    const { category, exclude, limit } = req.query;

    // Debug giá trị nhận được
    console.log("Received query params:", { category, exclude, limit });

    // Kiểm tra xem category có được cung cấp hay không
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Kiểm tra category có phải là ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Xây dựng query
    const query = {
      categories: category, // Đảm bảo categories trong model là mảng hoặc trường đơn chứa _id
    };

    // Thêm điều kiện exclude nếu hợp lệ
    if (exclude) {
      if (mongoose.Types.ObjectId.isValid(exclude)) {
        query._id = { $ne: new mongoose.Types.ObjectId(exclude) }; // Sửa ở đây: thêm 'new'
      } else {
        console.warn("Invalid exclude ID, ignoring:", exclude);
      }
    }

    // Giới hạn số lượng kết quả
    const limitNumber = parseInt(limit) || 3;

    // Debug query trước khi thực thi
    console.log("Query to be executed:", query);

    // Tìm sản phẩm liên quan
    const relatedProducts = await Product.find(query)
      .limit(limitNumber)
      .populate("categories", "name")
      .exec();

    // Debug kết quả
    console.log("Found products:", relatedProducts);

    if (!relatedProducts || relatedProducts.length === 0) {
      return res.status(404).json({ message: "No related products found" });
    }

    res.status(200).json(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
