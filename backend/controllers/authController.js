const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/index.js');

const User = db.user;

// ================= REGISTER =================
const register = async (req, res) => {
  try {
    const { username, email, password, roleId } = req.body;

    if (!username || !email || !password || !roleId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exist = await User.findOne({ where: { email } });
    if (exist) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId
    });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const token = jwt.sign(
      { id: user.id, roleId: user.roleId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 3600000 }); // 1 hour

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roleId: user.roleId
      }
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const token = jwt.sign(
      { id: user.id, roleId: user.roleId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 3600000 }); // 1 hour

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roleId: user.roleId
      }
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
const me = async (req, res) => {
  try {
    const currentUser = await User.findByPk(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      user: {
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        roleId: currentUser.roleId
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }

}
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error('GET USERS ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// ================= LOGOUT =================
const logout = async (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'lax' });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('LOGOUT ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, getAllUsers, me, logout };