const mongoose = require('mongoose');
const slugify = require('slugify');

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Please add comment content'],
        trim: true,
        maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: String,
    content: {
        type: String,
        required: [true, 'Please add content'],
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [CommentSchema]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create blog slug from the title
BlogSchema.pre('save', function(next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

// Calculate read time
BlogSchema.virtual('readTime').get(function() {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
});

module.exports = mongoose.model('Blog', BlogSchema);
