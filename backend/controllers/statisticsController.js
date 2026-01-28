const db = require('../models/index.js');
const User = db.user;

// Get basic user statistics
const getUserStatistics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    
    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.count({
      where: {
        createdAt: {
          [db.Sequelize.Op.gte]: thirtyDaysAgo
        }
      }
    });
    
    res.json({
      totalUsers,
      recentRegistrations
    });
  } catch (error) {
    console.error('Statistics Error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};

module.exports = {
  getUserStatistics
};
