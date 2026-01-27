const express = require('express')
const router = express.Router()
const db = require('../models')

// ===============================
// DASHBOARD STATS (DEBUG VERSION)
// ===============================
router.get('/stats', async (req, res) => {
  try {
    // 🔍 SHOW ALL MODEL NAMES
    console.log('AVAILABLE MODELS:', Object.keys(db))

    // ❗ TEMP: try User first
    if (db.User) {
      const totalUsers = await db.User.count()
      return res.json({ totalUsers })
    }

    // ❗ fallback: users
    if (db.users) {
      const totalUsers = await db.users.count()
      return res.json({ totalUsers })
    }

    // ❗ fallback: user
    if (db.user) {
      const totalUsers = await db.user.count()
      return res.json({ totalUsers })
    }

    // ❌ no user model found
    console.error('❌ No user model found')
    return res.json({ totalUsers: 0 })

  } catch (error) {
    console.error('DASHBOARD ERROR:', error)
    return res.json({ totalUsers: 0 })
  }
})

module.exports = router
