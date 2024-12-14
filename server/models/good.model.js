const db = require('../database/dbConnection');
class GoodModel {
  constructor(db) {
    this.db = db;
  }

  async getTotalGoodsCount() {
    try {
      const result = await this.db.one('SELECT COUNT(*) FROM goods WHERE deletedat IS NULL');
      return parseInt(result.count, 10);
    } catch (err) {
      console.error('Error getting total goods count:', err);
      throw err;
    }
  }
  async getAllGoods(limit, offset) {
    try {
      const result = await this.db.any('SELECT * FROM goods WHERE deletedat IS NULL LIMIT $1 OFFSET $2', [limit, offset]);
      return result;
    } catch (err) {
      console.error('Error getting all goods:', err);
      throw err;
    }
  }

  async getGoodById(id) {
    try {
      const result = await this.db.one('SELECT * FROM goods WHERE goodid = $1', [id]);
      return result;
    } catch (err) {
      console.error('Error getting good by id:', err);
      throw err;
    }
  }

  async createGood(good) {
    try {
      const result = await this.db.one(
        'INSERT INTO goods (plu, name, description, price, stockquantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [good.plu, good.name, good.description, good.price, good.stockquantity]
      );
      return result;
    } catch (err) {
      console.error('Error creating good:', err);
      throw err;
    }
  }

  async updateGood(id, good) {
    try {
      const result = await this.db.one(
        'UPDATE goods SET plu = $1, name = $2, description = $3, price = $4, stockquantity = $5 WHERE goodid = $6 RETURNING *',
        [good.plu, good.name, good.description, good.price, good.stockquantity, id]
      );
      return result;
    } catch (err) {
      console.error('Error updating good:', err);
      throw err;
    }
  }

  async deleteGood(id) {
    try {
      const result = await this.db.result('UPDATE goods SET deletedat = NOW() WHERE goodid = $1', [id]);
      return result;
    } catch (err) {
      console.error('Error soft deleting good:', err);
      throw err;
    }
  }
}
const goodModel = new GoodModel(db);
module.exports = goodModel;
