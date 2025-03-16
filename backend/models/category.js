const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    tag: [String],
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
