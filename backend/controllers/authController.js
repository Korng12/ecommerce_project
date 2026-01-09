const jwt = require('jsonwebtoken');
const db = require('../models');
const { validationResult } = require('express-validator');

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { 
      id: user.id, 
      username: user.username,
      email: user.email,
      role_id: user.role_id 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    
    // Check if user exists
    const userExists = await db.User.findOne({ 
      where: { 
        email 
      },
      transaction
    });
    
    if (userExists) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }

    // Get customer role
    const customerRole = await db.Role.findOne({ 
      where: { name: 'customer' },
      transaction 
    });
    
    if (!customerRole) {
      await transaction.rollback();
      return res.status(500).json({ error: 'Customer role not found' });
    }

    // Create user
    const user = await db.User.create({
      username,
      email,
      password,
      role_id: customerRole.id
    }, { transaction });

    // Create cart for user
    await db.Cart.create({
      user_id: user.id
    }, { transaction });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token
    user.refresh_token = refreshToken;
    await user.save({ transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id
      }
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user with role
    const user = await db.User.findOne({
      where: { email },
      include: [{
        model: db.Role,
        attributes: ['name']
      }]
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token
    user.refresh_token = refreshToken;
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        role_name: user.Role.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Find user
    const user = await db.User.findOne({
      where: { 
        id: decoded.id,
        refresh_token: refreshToken 
      },
      include: [{
        model: db.Role,
        attributes: ['name']
      }]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        email: user.email,
        role_id: user.role_id 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '15m' }
    );

    res.json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        role_name: user.Role.name
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Clear refresh token
    await db.User.update(
      { refresh_token: null },
      { where: { id: userId } }
    );

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      include: [{
        model: db.Role,
        attributes: ['name']
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        role_name: user.Role.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.adminRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    
    // Check if user exists
    const userExists = await db.User.findOne({ 
      where: { email }
    });
    
    if (userExists) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }

    // Get admin role
    const adminRole = await db.Role.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      return res.status(500).json({ error: 'Admin role not found' });
    }

    // Create admin user
    const user = await db.User.create({
      username,
      email,
      password,
      role_id: adminRole.id
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};