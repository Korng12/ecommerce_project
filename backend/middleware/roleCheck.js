/**
 * Role-based access control middleware
 * Usage: roleCheck('ADMIN') or roleCheck('ADMIN', 'USER')
 *
 * Requirements:
 * - verifyJwt middleware MUST run before this
 * - verifyJwt must set: req.user = { id, roleId }
 */

const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure user is authenticated
    if (!req.user || !req.user.roleId) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    const roleId = req.user.roleId

    // Map roleId -> role name
    // 1 = ADMIN, 2 = USER
    let roleName = null
    if (roleId === 1) roleName = 'ADMIN'
    if (roleId === 2) roleName = 'USER'

    if (!roleName) {
      return res.status(403).json({ message: 'Role not found' })
    }

    // Check permission
    if (!allowedRoles.includes(roleName)) {
      return res.status(403).json({ message: 'Access denied' })
    }

    // Authorized
    next()
  }
}

module.exports = roleCheck
