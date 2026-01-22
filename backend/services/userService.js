const db = require('../models')

const User = db.user
const Role = db.role

exports.getAll = async () => {
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
    name: u.username,
    email: u.email,
    role: u.role?.name === 'Admin' ? 'Admin' : 'User',
    status: 'Active'
  }))
}

exports.create = async (data) => {
  return await User.create({
    username: data.name,
    email: data.email,
    roleId: data.role === 'Admin' ? 1 : 2
  })
}

exports.update = async (id, data) => {
  return await User.update(
    {
      username: data.name,
      email: data.email,
      roleId: data.role === 'Admin' ? 1 : 2
    },
    { where: { id } }
  )
}

exports.remove = async (id) => {
  return await User.destroy({ where: { id } })
}
