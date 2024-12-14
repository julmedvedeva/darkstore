
const express = require('express');
const router = express.Router();
const goodController = require('../controllers/good.controller');

router.get('/', goodController.getAllGoods);
router.get('/:id', goodController.getGoodById);
router.post('/', goodController.createGood);
router.put('/:id', goodController.updateGood);
router.delete('/:id', goodController.deleteGood);


module.exports = router;
