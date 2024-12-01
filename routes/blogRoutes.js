const express = require('express');
const router = express.Router();
const { 
    createBlog, 
    getBlogs, 
    getBlog, 
    updateBlog, 
    deleteBlog, 
    addComment, 
    deleteComment,
    likeBlog 
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const { validateBlogPost, validateComment } = require('../validators/blogValidator');

router.route('/')
    .get(getBlogs)
    .post(protect, validateBlogPost, createBlog);

router.route('/:id')
    .get(getBlog)
    .put(protect, validateBlogPost, updateBlog)
    .delete(protect, deleteBlog);

router.route('/:id/comments')
    .post(protect, validateComment, addComment);

router.route('/:id/comments/:commentId')
    .delete(protect, deleteComment);

router.route('/:id/like')
    .post(protect, likeBlog);

module.exports = router;
