const goodModel = require('../models/good.model');

class GoodController {
  async getAllGoods(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const goods = await goodModel.getAllGoods(limit, offset);
      const totalGoods = await goodModel.getTotalGoodsCount();
      const totalPages = Math.ceil(totalGoods / limit);

      res.json({
        goods,
        pagination: {
          totalGoods,
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
  async getGoodById(req, res) {
    const { id } = req.params;
    try {
      const good = await goodModel.getGoodById(id);
      res.json(good);
    } catch (err) {
      if (err.code === 0) {
        console.error('code', err.code);
        res.status(404).send('Good not found');
      } else {
        console.error(err);
        res.status(500).send('Server error');
      }
    }
  }
  async createGood(req, res) {
    const good = req.body;
    try {
      const newGood = await goodModel.createGood(good);
      res.status(201).json(newGood);
    } catch (err) {
      if (err.code === 0) {
        console.error('code', err.code);
        res.status(409).send('Good already exists');
      } else {
        console.error(err);
        res.status(500).send('Server error');
      }
    }
  }

  async updateGood(req, res) {
    const { id } = req.params;
    const good = req.body;
    try {
      const updatedGood = await goodModel.updateGood(id, good);
      res.json(updatedGood);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }

  async deleteGood(req, res) {
    const { id } = req.params;
    try {
      await goodModel.deleteGood(id);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
}

module.exports = new GoodController();
