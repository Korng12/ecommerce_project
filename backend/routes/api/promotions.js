const router = require('express').Router();
const promotionController = require('../../controllers/promotionController');
const verifyJWT = require('../../middleware/authJwt');
const verifyRole = require('../../middleware/verifyRoles');




router.post(
  '/promotions',
  verifyJWT,
  verifyRole(1), // Admin only
  promotionController.createPromotion
);

// UPDATE PROMOTION
router.put(
  '/promotions/:id',
  verifyJWT,
  verifyRole(1), // Admin only
  promotionController.updatePromotion
);

// DELETE PROMOTION
router.delete(
  '/promotions/:id',
  verifyJWT,
  verifyRole(1), // Admin only
  promotionController.deletePromotion
);

// GET ALL PROMOTIONS
router.get('/promotions', promotionController.getAllPromotions);

// GET SINGLE PROMOTION
router.get('/promotions/:id', promotionController.getPromotionById);

module.exports = router;