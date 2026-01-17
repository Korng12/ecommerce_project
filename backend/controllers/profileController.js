const bcrypt =require('bcrypt')
const jwt =require('jsonwebtoken')
const db = require('../models/index.js')
require('dotenv').config()
const User= db.user;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: db.role, attributes: ['id', 'name'] }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('GET PROFILE ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, firstName, lastName, phone, address, avatar, dateOfBirth, gender } = req.body;
    
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await user.update({
      username: username || user.username,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone || user.phone,
      address: address || user.address,
      avatar: avatar || user.avatar,
      dateOfBirth: dateOfBirth || user.dateOfBirth,
      gender: gender || user.gender
    });

    const { password, ...userWithoutPassword } = updatedUser.toJSON();
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('UPDATE PROFILE ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    console.error('DELETE PROFILE ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('UPDATE PASSWORD ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    await user.update({ avatar: avatarPath });

    res.json({ avatar: avatarPath });
  } catch (err) {
    console.error('UPLOAD AVATAR ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  verifyToken,
  getProfile,
  updateProfile,
  deleteProfile,
  updatePassword,
  uploadAvatar
};
