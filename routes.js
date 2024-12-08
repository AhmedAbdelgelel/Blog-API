const express = require('express');
const router = express.Router();
const fs = require('fs');

// Simple in-memory storage for tokens (in production, use Redis or similar)
const activeTokens = new Set();

// Dummy users (in production, use a database)
const users = [
    { username: 'admin', password: 'admin123' }
];

// Authentication middleware
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token || !activeTokens.has(token)) {
        return res.status(401).json({ message: 'غير مصرح بالدخول' });
    }
    next();
};

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        const token = Math.random().toString(36).substring(7);
        activeTokens.add(token);
        res.json({ 
            message: 'تم تسجيل الدخول بنجاح',
            token 
        });
    } else {
        res.status(401).json({ message: 'اسم المستخدم او كلمة المرور غير صحيحة' });
    }
});

// Logout
router.post('/logout', authenticate, (req, res) => {
    const token = req.headers['authorization'];
    activeTokens.delete(token);
    res.json({ message: 'تم تسجيل الخروج بنجاح' });
});

// Get all cases categorized
router.get('/cases', authenticate, (req, res) => {
    try {
        const rapeCases = JSON.parse(fs.readFileSync('cases.json', 'utf8'));
        const trafficCases = JSON.parse(fs.readFileSync('traffic_accidents.json', 'utf8'));
        
        res.json({
            rape_cases: rapeCases.rape_cases,
            traffic_accidents: trafficCases.traffic_accidents
        });
    } catch (error) {
        res.status(500).json({ message: 'خطأ في قراءة البيانات' });
    }
});

// Get rape case by ID
router.get('/cases/:id', authenticate, (req, res) => {
    try {
        const cases = JSON.parse(fs.readFileSync('cases.json', 'utf8'));
        const caseId = req.params.id;
        let foundCase = null;

        Object.values(cases.rape_cases).forEach(category => {
            Object.values(category).forEach(caseItem => {
                if (caseItem.id === caseId) {
                    foundCase = caseItem;
                }
            });
        });

        if (foundCase) {
            res.json(foundCase);
        } else {
            res.status(404).json({ message: 'لم يتم العثور على القضية' });
        }
    } catch (error) {
        res.status(500).json({ message: 'خطأ في قراءة البيانات' });
    }
});

// Get traffic accident by ID
router.get('/accidents/:id', authenticate, (req, res) => {
    try {
        const accidents = JSON.parse(fs.readFileSync('traffic_accidents.json', 'utf8'));
        const accidentId = req.params.id;
        let foundAccident = null;

        Object.values(accidents.traffic_accidents).forEach(category => {
            Object.values(category).forEach(accident => {
                if (accident.id === accidentId) {
                    foundAccident = accident;
                }
            });
        });

        if (foundAccident) {
            res.json(foundAccident);
        } else {
            res.status(404).json({ message: 'لم يتم العثور على الحادث' });
        }
    } catch (error) {
        res.status(500).json({ message: 'خطأ في قراءة البيانات' });
    }
});

module.exports = router;
