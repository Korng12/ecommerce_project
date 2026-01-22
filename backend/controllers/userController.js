const userService = require('../services/userService')

exports.getUsers = async (req, res) => {
  const users = await userService.getAll()
  res.json(users)
}

exports.createUser = async (req, res) => {
  await userService.create(req.body)
  res.status(201).json({ message: 'User created' })
}

exports.updateUser = async (req, res) => {
  await userService.update(req.params.id, req.body)
  res.json({ message: 'User updated' })
}

exports.deleteUser = async (req, res) => {
  await userService.remove(req.params.id)
  res.json({ message: 'User deleted' })
}
