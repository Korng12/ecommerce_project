// const db = require('../models')
// const jwt = require('jsonwebtoken')

// /**
//  * =========================
//  * Generate JWT Tokens
//  * =========================
//  */
// const generateTokens = (user) => {
//   const accessToken = jwt.sign(
//     {
//       id: user.id,
//       email: user.email,
//       role_id: user.role_id, // ✅ CONSISTENT WITH FRONTEND
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRE || '1d' }
//   )

//   const refreshToken = jwt.sign(
//     { id: user.id },
//     process.env.REFRESH_TOKEN_SECRET,
//     { expiresIn: '7d' }
//   )

//   return { accessToken, refreshToken }
// }

// /**
//  * =========================
//  * ADMIN / MANAGER LOGIN
//  * =========================
//  */
// exports.adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body

//     if (!email || !password) {
//       return res.status(400).json({
//         message: 'Email and password are required',
//       })
//     }

//     const user = await db.User.findOne({
//       where: { email },
//       include: [{
//         model: db.Role,
//         attributes: ['name'],
//       }],
//     })

//     if (!user) {
//       return res.status(401).json({
//         message: 'Invalid credentials',
//       })
//     }

//     // 🔒 Allow only admin / manager
//     if (!['admin', 'manager'].includes(user.Role.name)) {
//       return res.status(403).json({
//         message: 'Access denied',
//       })
//     }

//     // 🔐 Password check
//     const isPasswordValid = await user.comparePassword(password)
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         message: 'Invalid credentials',
//       })
//     }

//     const { accessToken, refreshToken } = generateTokens(user)

//     // Save refresh token
//     user.refresh_token = refreshToken
//     await user.save()

//     return res.status(200).json({
//       success: true,
//       accessToken, // ✅ FRONTEND WILL USE THIS
//       refreshToken,
//       user: {
//         id: user.id,
//         email: user.email,
//         role_id: user.role_id,
//         role_name: user.Role.name,
//       },
//     })
//   } catch (error) {
//     console.error('ADMIN LOGIN ERROR:', error)
//     return res.status(500).json({
//       message: 'Server error',
//     })
//   }
// }

// /**
//  * =========================
//  * CUSTOMER LOGIN
//  * =========================
//  */
// exports.customerLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body

//     if (!email || !password) {
//       return res.status(400).json({
//         message: 'Email and password are required',
//       })
//     }

//     const user = await db.User.findOne({
//       where: { email },
//       include: [{
//         model: db.Role,
//         attributes: ['name'],
//       }],
//     })

//     if (!user) {
//       return res.status(401).json({
//         message: 'Invalid credentials',
//       })
//     }

//     const isPasswordValid = await user.comparePassword(password)
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         message: 'Invalid credentials',
//       })
//     }

//     const { accessToken, refreshToken } = generateTokens(user)

//     user.refresh_token = refreshToken
//     await user.save()

//     return res.status(200).json({
//       success: true,
//       accessToken, // ✅ FRONTEND WILL USE THIS
//       refreshToken,
//       user: {
//         id: user.id,
//         email: user.email,
//         role_id: user.role_id,
//         role_name: user.Role.name,
//       },
//     })
//   } catch (error) {
//     console.error('CUSTOMER LOGIN ERROR:', error)
//     return res.status(500).json({
//       message: 'Server error',
//     })
//   }
// }
