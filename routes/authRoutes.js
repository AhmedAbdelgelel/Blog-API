const express = require('express');
const router = express.Router();
const { signUp, login, logout } = require('../controllers/authController');
const { 
  validateSignup, 
  validateLogin, 
} = require('../validators/userValidation');

router.post('/signup', validateSignup, signUp);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

module.exports = router;
