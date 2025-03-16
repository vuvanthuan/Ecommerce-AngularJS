const Product = require("../models/product");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file nào được tải lên." });
    }
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "File quá lớn. Giới hạn là 5MB." });
    }

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
      quantity,
    } = req.body;

    const image = `/public/images/${req.file.filename}`;

    const product = new Product({
      name,
      price,
      description,
      image,
      dimensions: { height, diameter },
      designInfo: { designer, location },
      material,
      glazeColor,
      productCode,
      categories,
      tags: tags.split(",").map((tag) => tag.trim()),
      quantity: parseInt(quantity),
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
      image,
      location,
      material,
      glazeColor,
      productCode,
      categories,
      tags,
      quantity,
    } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại." });
    }

    // Cập nhật thông tin sản phẩm
    if (name) product.name = name;
    if (price) product.price = parseFloat(price);
    if (description) product.description = description;

    // Đảm bảo dimensions tồn tại trước khi cập nhật
    product.dimensions = product.dimensions || {};
    if (height !== undefined) product.dimensions.height = parseFloat(height);
    if (diameter !== undefined)
      product.dimensions.diameter = parseFloat(diameter);

    // Đảm bảo designInfo tồn tại trước khi cập nhật
    product.designInfo = product.designInfo || {};
    if (designer) product.designInfo.designer = designer;
    if (location) product.designInfo.location = location;

    if (material) product.material = material;
    if (glazeColor) product.glazeColor = glazeColor;
    if (productCode) product.productCode = productCode;
    if (categories) product.categories = categories;
    if (tags && typeof tags === "string") product.tags = tags.split(",").map((tag) => tag.trim());
    if (quantity) product.quantity = parseInt(quantity);
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

    // Lưu thay đổi vào database
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
