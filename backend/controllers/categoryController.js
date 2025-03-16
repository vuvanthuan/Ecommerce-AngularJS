const Category = require("../models/category");

exports.createCategory = async (req, res) => {
  try {
    const { name, tag } = req.body;

    // Kiểm tra và xử lý tag
    const tagsArray =
      typeof tag === "string" ? tag.split(",").map((tag) => tag.trim()) : [];

    const category = new Category({
      name,
      tag: tagsArray,
    });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tag } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Danh mục không tồn tại." });
    }

    // Kiểm tra và xử lý tag
    const tagsArray =
      typeof tag === "string"
        ? tag.split(",").map((tag) => tag.trim())
        : category.tag;

    category.name = name || category.name;
    category.tag = tagsArray;

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); //find() là find tất cả
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id); //findById(id) là theo id được truyền vào
    if (!category) {
      return res.status(404).json({ error: "Danh mục không tồn tại." });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Danh mục đã được xóa thành công." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
