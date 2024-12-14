
const express = require('express');
const router = express.Router();
const orderGoodsController = require('../controllers/orderGoods.controller');

router.get('/:id', orderGoodsController.getOrderGoodsById);
router.post('/', orderGoodsController.create);
router.put('/:id', orderGoodsController.update);


module.exports = router;
