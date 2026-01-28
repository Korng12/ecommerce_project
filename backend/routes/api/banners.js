const express = require('express')
const router = express.Router()

const bannerController = require('../../controllers/bannerController')
const upload = require('../../middleware/upload') // ✅ function

/// GET all banners
router.get('/', bannerController.getAll)

// CREATE banner
router.post(
  '/',
  upload('banners').single('image'),
  bannerController.create
)

// UPDATE banner
router.put(
  '/:id',
  upload('banners').single('image'),
  bannerController.update
)

// DELETE banner
router.delete('/:id', bannerController.remove)
module.exports = router
