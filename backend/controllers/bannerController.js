const { Banner } = require('../models')

/* ================= GET ALL ================= */
exports.getAll = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      order: [['position', 'ASC']]
    })
    res.json(banners)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ================= CREATE ================= */
exports.create = async (req, res) => {
  try {
    // ✅ image is REQUIRED on create
    if (!req.file) {
      return res.status(400).json({ message: 'Banner image is required' })
    }

    const banner = await Banner.create({
      title: req.body.title,
      link: req.body.link || null,
      status: req.body.status || 'active',
      position: req.body.position || 1,
      // ✅ ONLY filename
      image_url: req.file.filename
    })

    res.status(201).json(banner)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ================= UPDATE ================= */
exports.update = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id)
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' })
    }

    // ✅ update only if value exists
    banner.title = req.body.title ?? banner.title
    banner.link = req.body.link ?? banner.link
    banner.status = req.body.status ?? banner.status
    banner.position = req.body.position ?? banner.position

    // ✅ update image only if new one uploaded
    if (req.file) {
      banner.image_url = req.file.filename
    }

    await banner.save()
    res.json(banner)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ================= DELETE ================= */
exports.remove = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id)
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' })
    }

    await banner.destroy()
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
