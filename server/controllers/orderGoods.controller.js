const orderGoodsModel = require('../models/orderGoods.model');

class OrderGoodsController {
  constructor(db) {
    this.db = db;
  }

  async getOrderGoodsById(req, res) {
    const { id } = req.params;
    try {
      const order = await orderGoodsModel.getOrderById(id);
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }

  async create(req, res) {
    const order = req.body;

    try {
      const newOrder = await orderGoodsModel.create(order);
      res.status(201).json(newOrder);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const order = req.body;
    try {
      const updatedOrder = await orderGoodsModel.update(id, order);
      res.json(updatedOrder);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }

}

module.exports = new OrderGoodsController();
