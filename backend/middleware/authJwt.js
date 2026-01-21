const jwt = require('jsonwebtoken');

const verifyJwt = (req, res, next) => {
  const token = req.cookies.token; // 🔥 THIS IS THE FIX

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      roleId: decoded.roleId
    };

    next(); // 🔥 REQUIRED
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyJwt;
