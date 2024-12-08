const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';

    res.status(statusCode).json({
        success: false,
        error: err.message
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`الصفحة غير موجودة - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound };
