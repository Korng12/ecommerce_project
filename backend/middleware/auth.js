// const jwt = require('jsonwebtoken');
// const db = require('../models');

// const auth = async (req, res, next) => {
//   try {
//     const authHeader = req.header('Authorization');
    
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ error: 'No token provided' });
//     }

//     const token = authHeader.replace('Bearer ', '');
    
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     const user = await db.User.findOne({
//       where: { id: decoded.id },
//       include: [{
//         model: db.Role,
//         attributes: ['name']
//       }]
//     });

//     if (!user) {
//       return res.status(401).json({ error: 'User not found' });
//     }

//     req.user = user;
//     req.token = token;
//     next();
//   } catch (error) {
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({ error: 'Invalid token' });
//     }
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ error: 'Token expired' });
//     }
//     res.status(401).json({ error: 'Please authenticate' });
//   }
// };

// module.exports = auth;