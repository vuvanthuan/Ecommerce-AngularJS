const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Import middleware upload

// Route để upload ảnh
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Không có file nào được tải lên." });
        }

        // Trả về đường dẫn ảnh
        const imageUrl = `/public/images/${req.file.filename}`;
        res.status(200).json({ url: imageUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
