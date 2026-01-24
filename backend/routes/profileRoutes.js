const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {verifyToken, getProfile, updateProfile, deleteProfile, updatePassword, uploadAvatar} = require('../controllers/profileController')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});
router.use(verifyToken);

router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/password', updatePassword);
router.delete('/', deleteProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);

module.exports=router
