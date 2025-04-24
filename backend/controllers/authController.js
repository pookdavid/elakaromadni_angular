//authcontroller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
  // Debug: Log incoming request
  console.log('Registration request received. Headers:', req.headers);
  console.log('Request body:', req.body);

  // 1. Validate request body exists
  if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
    console.error('Registration failed: Empty request body');
    return res.status(400).json({
      success: false,
      error: 'Request body must be a valid JSON object with username, email, and password'
    });
  }

  // 2. Destructure with fallbacks
  const { 
    username = null, 
    email = null, 
    password = null 
  } = req.body;

  // 3. Validate required fields
  const missingFields = [];
  if (!username) missingFields.push('username');
  if (!email) missingFields.push('email');
  if (!password) missingFields.push('password');

  if (missingFields.length > 0) {
    console.error(`Registration failed: Missing fields - ${missingFields.join(', ')}`);
    return res.status(400).json({
      success: false,
      error: `Missing required fields: ${missingFields.join(', ')}`,
      missingFields
    });
  }

  // 4. Trim whitespace
  const cleanUsername = username.toString().trim();
  const cleanEmail = email.toString().trim();
  const cleanPassword = password.toString().trim();

  // 5. Validate field formats
  const validationErrors = [];
  
  if (cleanUsername.length < 3) {
    validationErrors.push('Username must be at least 3 characters');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    validationErrors.push('Invalid email format');
  }

  if (cleanPassword.length < 6) {
    validationErrors.push('Password must be at least 6 characters');
  }

  if (validationErrors.length > 0) {
    console.error('Registration failed: Validation errors', validationErrors);
    return res.status(400).json({
      success: false,
      errors: validationErrors
    });
  }

  try {
    // 6. Check for existing user
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username: cleanUsername },
          { email: cleanEmail }
        ]
      }
    });

    if (existingUser) {
      const conflictField = existingUser.username === cleanUsername ? 'username' : 'email';
      console.error(`Registration failed: ${conflictField} already exists`);
      return res.status(409).json({
        success: false,
        error: `${conflictField} already in use`,
        conflictField
      });
    }

    // 7. Create user
    const hashedPassword = await bcrypt.hash(cleanPassword, 10);
    const user = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      passwordHash: hashedPassword,
      role: 'user'
    });

    // 8. Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 9. Success response
    console.log(`User ${user.id} registered successfully`);
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Registration failed due to server error',
      ...(process.env.NODE_ENV === 'development' && {
        debug: {
          message: error.message,
          stack: error.stack
        }
      })
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ 
      where: { email } 
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return response
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
  
  exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = decoded;
      next();
    });
  };
};