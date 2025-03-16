const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const uploadRouter = require('./routes/uploadRoutes');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Tạo thư mục public/images nếu chưa tồn tại
const imageDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

// Phục vụ file tĩnh từ thư mục public
app.use('/public', express.static(path.join(__dirname, 'public')));

// Middleware
app.use(cors());

app.use('/api/upload', uploadRouter); // Route upload ảnh

app.use(express.json({ limit: '50mb' })); // Giới hạn kích thước JSON request
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Giới hạn kích thước form-data

// Import routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const couponRoutes = require('./routes/couponRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/orders', orderRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
