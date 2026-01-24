const db = require('../models')
const bcrypt = require('bcrypt')

const User = db.user
const Role = db.role

module.exports = {
  // ================= GET ALL USERS =================
  async getAll() {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['name']
        }
      ]
    })

    return users.map(u => ({
      id: u.id,
      name: u.username || 'Unknown',
      email: u.email,
      role: u.role?.name?.toUpperCase() || 'USER',
      status: 'Active'
    }))
  },

  // ================= CREATE USER =================
  async create(data) {
    if (!data.password) {
      throw new Error('Password is required')
    }

    const roleId =
      data.role === 'ADMIN' || data.role === 'Admin' ? 1 : 2

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await User.create({
      username: data.name,
      email: data.email,
      password: hashedPassword,   // ✅ FIX
      roleId
    })

    return {
      id: user.id,
      name: user.username,
      email: user.email,
      role: roleId === 1 ? 'ADMIN' : 'USER',
      status: 'Active'
    }
  },

  // ================= UPDATE USER =================
  async update(id, data) {
    const roleId =
      data.role === 'ADMIN' || data.role === 'Admin' ? 1 : 2

    const updateData = {
      username: data.name,
      email: data.email,
      roleId
    }

    // update password ONLY if provided
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10)
    }

    await User.update(updateData, { where: { id } })

    return true
  },

  // ================= DELETE USER =================
  async remove(id) {
    await User.destroy({ where: { id } })
    return true
  }
}
