const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Simple in-memory storage for tokens (in production, use Redis or similar)
const activeTokens = new Set();

// Dummy users (in production, use a database)
const users = [
    { username: 'admin', password: 'admin123' }
];

exports.login = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;
    
    // Check if username and password exist
    if (!username || !password) {
        return next(new AppError('الرجاء إدخال اسم المستخدم وكلمة المرور', 400));
    }

    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return next(new AppError('اسم المستخدم او كلمة المرور غير صحيحة', 401));
    }

    const token = Math.random().toString(36).substring(7);
    activeTokens.add(token);
    
    res.json({ 
        message: 'تم تسجيل الدخول بنجاح',
        token 
    });
});

exports.signup = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;
    
    // Check if username and password exist
    if (!username || !password) {
        return next(new AppError('الرجاء إدخال اسم المستخدم وكلمة المرور', 400));
    }

    // Check if user already exists
    if (users.find(u => u.username === username)) {
        return next(new AppError('اسم المستخدم موجود بالفعل', 400));
    }

    // Add new user
    users.push({ username, password });

    // Auto login after signup
    const token = Math.random().toString(36).substring(7);
    activeTokens.add(token);
    
    res.status(201).json({ 
        message: 'تم إنشاء الحساب بنجاح',
        token 
    });
});

exports.logout = asyncHandler(async (req, res) => {
    const token = req.headers['authorization'];
    activeTokens.delete(token);
    res.json({ message: 'تم تسجيل الخروج بنجاح' });
});

exports.protect = asyncHandler(async (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return next(new AppError('الرجاء تسجيل الدخول للوصول إلى هذا المحتوى', 401));
    }

    if (!activeTokens.has(token)) {
        return next(new AppError('غير مصرح بالدخول', 401));
    }

    next();
});

// Export activeTokens for testing purposes
exports.activeTokens = activeTokens;
