const db = require('../models')

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
      role: u.role || 'USER',
      status: 'Active'
    }))
  },

  // ================= CREATE USER =================
  async create(data) {
    const roleId = data.role === 'Admin' || data.role === 'ADMIN' ? 1 : 2

    const user = await User.create({
      username: data.name,
      email: data.email,
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
    const roleId = data.role === 'Admin' || data.role === 'ADMIN' ? 1 : 2

    await User.update(
      {
        username: data.name,
        email: data.email,
        roleId
      },
      { where: { id } }
    )

    return true
  },

  // ================= DELETE USER =================
  async remove(id) {
    await User.destroy({ where: { id } })
    return true
  }
}
