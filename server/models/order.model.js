
const db = require('../database/dbConnection');

class OrderModel {
  constructor(db) {
    this.db = db;
  }

  async getTotalOrdersCount() {
    try {
      const result = await this.db.one('SELECT COUNT(*) FROM orders WHERE deletedat IS NULL');
      return parseInt(result.count, 10);
    } catch (err) {
      console.error('Error getting total orders count:', err);
      throw err;
    }
  }
  async getAllOrders(limit, offset) {
    try {
      const result = await this.db.any('SELECT * FROM orders WHERE deletedat IS NULL LIMIT $1 OFFSET $2', [limit, offset]);
      return result;
    } catch (err) {
      console.error('Error getting all orders:', err);
      throw err;
    }
  }

  async getOrderById(id) {
    try {
      const result = await this.db.one('SELECT * FROM orders WHERE orderid = $1', [id]);
      return result;
    } catch (err) {
      console.error('Error getting order by id:', err);
      throw err;
    }
  }

  async createOrder(order) {
    try {
      const result = await this.db.one(
        'INSERT INTO orders (totalamount) VALUES ($1) RETURNING *',
        [order.totalamount]
      );
      return result;
    } catch (err) {
      console.error('Error creating order:', err);
      throw err;
    }
  }

  async updateOrder(id, order) {
    try {
      const result = await this.db.one(
        'UPDATE orders SET totalamount = $1 WHERE orderid = $2 RETURNING *',
        [order.totalamount, id]
      );
      return result;
    } catch (err) {
      console.error('Error updating order:', err);
      throw err;
    }
  }

  async deleteOrder(id) {
    try {
      const result = await this.db.result('UPDATE orders SET deletedat = NOW()WHERE orderid = $1', [id]);
      return result;
    } catch (err) {
      console.error('Error soft deleting order:', err);
      throw err;
    }
  }
}
const orderModel = new OrderModel(db);
module.exports = orderModel;
