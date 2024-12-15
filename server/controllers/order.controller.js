const { body, param, query, validationResult } = require('express-validator');
const orderModel = require('../models/order.model');
const orderGoodsModel = require('../models/orderGoods.model');

class OrderController {
  constructor(db) {
    this.db = db;
  }

  async getAllOrders(req, res) {
    await query('page').optional().isInt({ min: 1 }).toInt();
    await query('limit').optional().isInt({ min: 1 }).toInt();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const orders = await orderModel.getAllOrders(limit, offset);
      const totalOrders = await orderModel.getTotalOrdersCount();
      const totalPages = Math.ceil(totalOrders / limit);

      for (const order of orders) {
        const orderWithGoods = await orderGoodsModel.getOrderById(order.orderid);
        order.goods = orderWithGoods;
      }

      res.json({
        orders,
        pagination: {
          totalOrders,
          totalPages,
          currentPage: page,
          limit,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }

  async getOrderById(req, res) {
    await param('id').isInt();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    try {
      const order = await orderModel.getOrderById(id);
      const orderWithGoods = await orderGoodsModel.getOrderById(id);
      order.goods = orderWithGoods;
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }

  async createOrder(req, res) {
    await body('totalamount')
      .isFloat({ gt: 0 })
      .withMessage('Total amount must be a number greater than zero')
      .custom(value => {
        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
          throw new Error('Total amount must have at most two decimal places');
        }
        return true;
      });
    await body('goods').isArray().withMessage('Goods must be an array');
    await body('goods.*.goodid').isInt().withMessage('Good ID must be an integer');
    await body('goods.*.goodname').isString().isLength({ max: 255 }).withMessage('Good name must be a string with a maximum length of 255 characters');
    await body('goods.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = req.body;
    try {
      const newOrder = await orderModel.createOrder(order);
      const newOrderWithGoods = [];
      for (const good of order.goods) {
        const newOrderGoods = await orderGoodsModel.create({ orderid: newOrder.orderid, goodid: good.goodid, goodName: good.goodname, quantity: good.quantity });
        newOrderWithGoods.push(newOrderGoods);
      }
      res.status(201).json({ ...newOrder, goods: newOrderWithGoods });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }

  async updateOrder(req, res) {
    // Валидация параметра id и тела запроса
    await param('id').isInt();
    await body('totalamount').optional().isNumeric();
    await body('goods').optional().isArray();
    await body('goods.*.goodid').optional().isInt();
    await body('goods.*.goodname').optional().isString().isLength({ max: 255 });
    await body('goods.*.quantity').optional().isInt({ min: 1 });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const order = req.body;
    try {
      const updatedOrder = await orderModel.updateOrder(id, order);
      const updatedOrderWithGoods = [];
      for (const good of order.goods) {
        const updatedOrderGoods = await orderGoodsModel.update(id, { orderid: updatedOrder.orderid, goodid: good.goodid, goodName: good.goodname, quantity: good.quantity, ordersgoodsid: good.ordersgoodsid });
        updatedOrderWithGoods.push(updatedOrderGoods);
      }
      res.json({ ...updatedOrder, goods: updatedOrderWithGoods });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }


  async deleteOrder(req, res) {
    await param('id').isInt();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    try {
      await orderModel.deleteOrder(id);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
}

module.exports = new OrderController();
