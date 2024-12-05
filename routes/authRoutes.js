const express = require('express');
const router = express.Router();
const { signUp, login, logout, uploadAvatar } = require('../controllers/authController');
const { 
  validateSignup, 
  validateLogin, 
} = require('../validators/userValidation');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/signup', validateSignup, signUp);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
