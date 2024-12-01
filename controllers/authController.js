const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Signup attempt with:', { email, username });

  try {
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }]
    });
    
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        code: 'USER_EXISTS',
        message: userExists.email === email ? 'Email already exists' : 'Username already exists',
        details: { field: userExists.email === email ? 'email' : 'username' }
      });
    }

    const newUser = new User({ 
      username, 
      email, 
      password
    });

    await newUser.save();
    console.log('User saved successfully');

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ 
      status: 'success',
      message: 'User created successfully',
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email
        },
        token
      }
    });
  } catch (err) {
    console.error('Error in signup:', err);
    res.status(500).json({
      status: 'error',
      code: 'SERVER_ERROR',
      message: 'Failed to create user',
      details: { error: err.message }
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        details: { field: 'email' }
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        details: { field: 'password' }
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        },
        token
      }
    });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({
      status: 'error',
      code: 'SERVER_ERROR',
      message: 'Login failed',
      details: { error: err.message }
    });
  }
};

module.exports = { signUp, login };
