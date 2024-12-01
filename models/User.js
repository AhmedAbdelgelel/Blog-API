const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    profilePicture: {
        type: String,
        default: 'default.jpg'
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot be more than 500 characters']
    }
}, {
    timestamps: true
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.error('Password hashing error:', error);
        next(error);
    }
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    if (!this.password) {
        console.error('No password found for user');
        return false;
    }
    
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        console.error('Password comparison error:', error);
        return false;
    }
};

module.exports = mongoose.model('User', UserSchema);
