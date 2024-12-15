const { body, param, query, validationResult } = require('express-validator');
const goodModel = require('../models/good.model');

class GoodController {
  async getAllGoods(req, res) {
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
    await param('id').isInt().run(req);
    const errors = validationResult(req);
    const { id } = req.params;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
    await body('plu').isString().isLength({ max: 10 }).withMessage('PLU must be a string with a maximum length of 10 characters').run(req);
    await body('name').isString().isLength({ max: 255 }).withMessage('Name must be a string with a maximum length of 255 characters').run(req);
    await body('description').optional().isString().isLength({ max: 255 }).withMessage('Description must be a string with a maximum length of 255 characters').run(req);
    await body('price').isInt({ min: 0 }).withMessage('Price must be a number').run(req);
    await body('stockquantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
    await param('id').isInt().run(req);
    await body('plu').optional().isString().isLength({ max: 10 }).run(req);
    await body('name').optional().isString().isLength({ max: 255 }).run(req);
    await body('description').optional().isString().isLength({ max: 255 }).run(req);
    await body('price').optional().isInt({ min: 0 }).run(req);
    await body('stockquantity').optional().isInt({ min: 0 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
    await param('id').isInt().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
