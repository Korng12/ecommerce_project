const service = require('../services/products')

exports.getAll = async (req, res) => {
  res.json(await service.getAll())
}

exports.create = async (req, res) => {
  res.status(201).json(await service.create(req.body))
}

exports.update = async (req, res) => {
  res.json(await service.update(req.params.id, req.body))
}

exports.remove = async (req, res) => {
  await service.remove(req.params.id)
  res.json({ message: 'Deleted' })
}
