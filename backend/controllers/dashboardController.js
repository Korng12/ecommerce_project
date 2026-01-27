const db = require('../models')
const User = db.user

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count()

    res.json({
      totalUsers
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}
