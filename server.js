const express = require('express');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const accidentRoutes = require('./routes/accidentRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Basic endpoints
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', time: new Date().toISOString() });
});

app.get('/api', (req, res) => {
    res.json({ 
        message: 'مرحبا بكم في نظام إدارة القضايا والحوادث',
        version: '1.0.0'
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/accidents', accidentRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/api`);
    console.log(`
Available endpoints:
- GET /api - Welcome message and version
- GET /api/health - System health check
- POST /api/auth/login - Login with username and password
- POST /api/auth/logout - Logout (requires authentication)
- GET /api/cases - Get all cases categorized (requires authentication)
- GET /api/cases/:id - Get specific case by ID (requires authentication)
- GET /api/accidents - Get all accidents categorized (requires authentication)
- GET /api/accidents/:id - Get specific accident by ID (requires authentication)
    `);
});
