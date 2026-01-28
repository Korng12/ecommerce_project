const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')
const db = require('../models/index.js')
require('dotenv').config()
const User= db.user;

// ================= GET PROFILE =================
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
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

// ================= UPDATE PROFILE =================
const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    const updatedUser = await user.update({
      username: username || user.username,
      email: email || user.email
    });

    const { password, ...userWithoutPassword } = updatedUser.toJSON();
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('UPDATE PROFILE ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= DELETE PROFILE =================
const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
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

// ================= UPDATE PASSWORD =================
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('UPDATE PASSWORD ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= UPLOAD AVATAR =================
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In a real app, you'd save the file and store the path
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    await user.update({ avatar: avatarPath });

    res.json({ avatar: avatarPath });
  } catch (err) {
    console.error('UPLOAD AVATAR ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  updatePassword,
  uploadAvatar
};
