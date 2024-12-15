
const db = require('../database/dbConnection');

class OrderGoodsModel {
  constructor(db) {
    this.db = db;
  }

  async getOrderById(id, limit, offset) {
    try {
      const result = await this.db.any('SELECT * FROM ordersgoods WHERE orderid = $1 LIMIT $2 OFFSET $3', [id, limit, offset]);
      return result;
    } catch (err) {
      console.error('Error getting order by id:', err);
      throw err;
    }
  }

  async create(order) {
    try {
      const result = await this.db.one(
        'INSERT INTO ordersgoods (orderid, goodid, quantity, goodName) VALUES ($1, $2, $3, $4) RETURNING *',
        [order.orderid, order.goodid, order.quantity, order.goodName]
      );
      return result;
    } catch (err) {
      console.error('Error creating order:', err);
      throw err;
    }
  }

  async update(id, order) {
    try {
      const result = await this.db.one(
        'UPDATE ordersgoods SET goodid = $1, goodName = $2, quantity = $3 WHERE orderid = $4 AND ordersgoodsid = $5 RETURNING *',
        [order.goodid, order.goodName, order.quantity, id, order.ordersgoodsid]
      );
      return result;
    } catch (err) {
      console.error('Error updating order:', err);
      throw err;
    }
  }

}
const orderGoodsModel = new OrderGoodsModel(db);
module.exports = orderGoodsModel;
