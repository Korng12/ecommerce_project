const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors({
  origin: 'http://localhost:5173'
}))
app.use(express.json())

// ROUTES
app.use('/api/admin/products', require('./routes/products'))

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
