const db = require('../models');
const jwt = require('jsonwebtoken');

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

exports.adminLogin = async (req, res) => {
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

    // Check if user is admin or manager
    if (!['admin', 'manager'].includes(user.Role.name)) {
      return res.status(403).json({ error: 'Access denied. Admin or manager access required.' });
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

exports.customerLogin = async (req, res) => {
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