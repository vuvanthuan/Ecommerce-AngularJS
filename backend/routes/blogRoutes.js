const express = require('express');
const router = express.Router();
const { createBlog, getBlogById, getBlogs, updateBlog, deleteBlog } = require('../controllers/blogController');

router.post('/', createBlog);
router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;
