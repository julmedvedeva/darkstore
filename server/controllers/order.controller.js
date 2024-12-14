const orderModel = require('../models/order.model');
const orderGoodsModel = require('../models/orderGoods.model');

class OrderController {
  constructor(db) {
    this.db = db;
  }
  async getAllOrders(req, res) {
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
    const { id } = req.params;
    try {
      const order = await orderModel.getOrderById(id);
      const orderWithGoods = await orderGoodsModel.getOrderById(id);
      console.log('orderWithGoods', orderWithGoods);
      order.goods = orderWithGoods;
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }

  async createOrder(req, res) {
    const order = req.body;
    try {
      const newOrder = await orderModel.createOrder(order);
      const newOrderWithGoods = [];
      for (const good of order.goods) {
        console.log('createOrder:good', good);
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
