const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.sendStatus(401)

  const token = authHeader.split(' ')[1]
  req.user = jwt.verify(token, process.env.JWT_SECRET)
  next()
}
