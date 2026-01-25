// const jwt = require('jsonwebtoken')
// const db = require('../models')

// const verifyJWT = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'No token provided' })
//     }

//     const token = authHeader.split(' ')[1]

//     const decoded = jwt.verify(token, process.env.JWT_SECRET)

//     // ✅ FIXED: db.User + include Role
//     const user = await db.User.findByPk(decoded.id, {
//       include: [
//         {
//           model: db.Role,
//           attributes: ['id', 'name'],
//         },
//       ],
//     })

//     if (!user) {
//       return res.status(401).json({ message: 'User not found' })
//     }

//     // ✅ Attach clean user object
//     req.user = {
//       id: user.id,
//       email: user.email,
//       roleId: user.roleId,
//       roleName: user.Role?.name,
//     }

//     next()
//   } catch (err) {
//     console.error('VERIFY JWT ERROR:', err)
//     return res.status(403).json({ message: 'Invalid token' })
//   }
// }

// module.exports = verifyJWT
