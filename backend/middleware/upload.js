const multer = require('multer');
const path = require('path');

// Kiểm tra loại file hợp lệ
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ hỗ trợ upload file ảnh (JPG, PNG, GIF, WEBP)!'), false);
    }
};

// Cấu hình Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Lưu ảnh vào thư mục public/images
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Tạo tên file duy nhất
    }
});

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn kích thước file (5MB)
});

module.exports = upload;
