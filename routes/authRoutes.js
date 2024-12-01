const express = require('express');
const router = express.Router();
const { signUp, login } = require('../controllers/authController');
const { 
  validateSignup, 
  validateLogin, 
} = require('../validators/userValidation');

router.post('/signup', validateSignup, signUp);
router.post('/login', validateLogin, login);

module.exports = router;
