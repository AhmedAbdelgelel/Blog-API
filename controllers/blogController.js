const asyncHandler = require('express-async-handler');
const Blog = require('../models/Blog');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
exports.createBlog = asyncHandler(async (req, res) => {
    req.body.author = req.user.id;
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
});

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find()
        .populate('author', 'username')
        .sort('-createdAt');
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
});

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id)
        .populate('author', 'username')
        .populate('comments.user', 'username');

    if (!blog) {
        throw new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404);
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({ success: true, data: blog });
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
exports.updateBlog = asyncHandler(async (req, res) => {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
        throw new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404);
    }

    // Make sure user is blog owner
    if (blog.author.toString() !== req.user.id) {
        throw new ErrorResponse(`User ${req.user.id} is not authorized to update this blog`, 401);
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: blog });
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
exports.deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        throw new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404);
    }

    // Make sure user is blog owner
    if (blog.author.toString() !== req.user.id) {
        throw new ErrorResponse(`User ${req.user.id} is not authorized to delete this blog`, 401);
    }

    await blog.deleteOne();

    res.status(200).json({ success: true, data: {} });
});

// @desc    Add comment to blog
// @route   POST /api/blogs/:id/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        throw new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404);
    }

    const comment = {
        content: req.body.content,
        user: req.user.id
    };

    blog.comments.unshift(comment);
    await blog.save();

    res.status(200).json({ success: true, data: blog });
});

// @desc    Delete comment
// @route   DELETE /api/blogs/:id/comments/:commentId
// @access  Private
exports.deleteComment = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        throw new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404);
    }

    // Pull out comment
    const comment = blog.comments.find(
        comment => comment.id === req.params.commentId
    );

    if (!comment) {
        throw new ErrorResponse(`Comment not found with id of ${req.params.commentId}`, 404);
    }

    // Make sure user is comment owner
    if (comment.user.toString() !== req.user.id) {
        throw new ErrorResponse(`User ${req.user.id} is not authorized to delete this comment`, 401);
    }

    // Get remove index
    const removeIndex = blog.comments
        .map(comment => comment.id)
        .indexOf(req.params.commentId);

    blog.comments.splice(removeIndex, 1);
    await blog.save();

    res.status(200).json({ success: true, data: blog });
});

// @desc    Like/Unlike blog
// @route   POST /api/blogs/:id/like
// @access  Private
exports.likeBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        throw new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404);
    }

    // Check if blog has already been liked by this user
    const liked = blog.likes.includes(req.user.id);

    if (liked) {
        // Unlike
        blog.likes = blog.likes.filter(like => like.toString() !== req.user.id);
    } else {
        // Like
        blog.likes.unshift(req.user.id);
    }

    await blog.save();

    res.status(200).json({ success: true, data: blog });
});
