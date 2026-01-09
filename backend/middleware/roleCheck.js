const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!req.user.Role) {
      return res.status(403).json({ 
        error: 'User role not found' 
      });
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.Role.name)) {
      return res.status(403).json({ 
        error: 'Access denied.' 
      });
    }

    next();
  };
};

module.exports = roleCheck;