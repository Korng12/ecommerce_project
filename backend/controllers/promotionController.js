const db=require('../models');
const Promotion=db.promotions;
const Product=db.product;

/* ================ CREATE PROMOTION ================ */
const createPromotion=async(req,res)=>{
  try{
    const{ name,type,value,startDate,endDate,isActive,productIds }=req.body;

    const promotion=await Promotion.create({
      name,
      type,
      value,
      startDate,
      endDate,
      isActive
    });

    // Associate products with the promotion
    if(productIds && productIds.length>0){
      const products=await Product.findAll({
        where:{ id:productIds }
      });
      await promotion.addProducts(products);
    }

    res.status(201).json(promotion);
  }catch(error){
    console.error('Error creating promotion:',error);
    res.status(500).json({ message:'Internal server error' });
  }
};

/* ================ GET ALL PROMOTIONS ================ */
const getAllPromotions=async(req,res)=>{
  try{
    const promotions=await Promotion.findAll({
      include:[{
        model:Product,
        as:'products'
      }]
    });
    res.status(200).json(promotions);
  }catch(error){
    console.error('Error fetching promotions:',error);
    res.status(500).json({ message:'Internal server error' });
  }
};

module.exports={
  createPromotion,
  getAllPromotions
};