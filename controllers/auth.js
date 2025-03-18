const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const User = require('../models/user');

const saltRounds = 12;

// Apply CORS specifically to auth routes
const corsOptions = {
  origin: ['https://kidstop.netlify.app', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Apply CORS to all auth routes
router.use(cors(corsOptions));

router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    
    if (userInDatabase) {
      return res.status(409).json({err: 'Username already taken.'});
    }
    
    const user = await User.create({
      username: req.body.username,
      hashedPassword: bcrypt.hashSync(req.body.password, saltRounds),
      firstName: req.body.firstName,
      email: req.body.email,
      lastName: req.body.lastName
    });

    const payload = { username: user.username, _id: user._id, firstName: user.firstName };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post('/sign-in', async (req, res) => {
  // Explicitly set CORS headers for this specific route
  res.header('Access-Control-Allow-Origin', 'https://kidstop.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password, user.hashedPassword
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    const payload = { username: user.username, _id: user._id, firstName: user.firstName };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
