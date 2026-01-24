const userService = require('../services/userService')

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getAll()
    res.json(users)
  } catch (err) {
    console.error('GET USERS ERROR:', err)
    res.status(500).json({ message: err.message })
  }
}

exports.createUser = async (req, res) => {
  try {
    const user = await userService.create(req.body)
    res.status(201).json(user)
  } catch (err) {
    console.error('CREATE USER ERROR:', err)
    res.status(500).json({ message: err.message })
  }
}

exports.updateUser = async (req, res) => {
  try {
    await userService.update(req.params.id, req.body)
    res.json({ message: 'User updated' })
  } catch (err) {
    console.error('UPDATE USER ERROR:', err)
    res.status(500).json({ message: err.message })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    await userService.remove(req.params.id)
    res.json({ message: 'User deleted' })
  } catch (err) {
    console.error('DELETE USER ERROR:', err)

    if (err.message === 'Cannot delete the last admin') {
      return res.status(400).json({ message: err.message })
    }

    res.status(500).json({ message: err.message })
  }
}


