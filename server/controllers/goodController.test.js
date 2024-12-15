const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const GoodController = require('../controllers/good.controller');
const goodModel = require('../models/good.model');
const app = express();

app.use(bodyParser.json());
app.get('/api/goods', GoodController.getAllGoods);
app.get('/api/goods/:id', GoodController.getGoodById);
app.post('/api/goods', GoodController.createGood);
app.put('/api/goods/:id', GoodController.updateGood);
app.delete('/api/goods/:id', GoodController.deleteGood);

jest.mock('../models/good.model');

describe('GoodController', () => {
  const mockGood = {
    plu: '1234567890',
    name: 'Test Good',
    description: 'This is a test good',
    price: 10.00,
    stockquantity: 100,
  };

  it('should get all goods', async () => {
    goodModel.getAllGoods.mockResolvedValue([mockGood]);
    goodModel.getTotalGoodsCount.mockResolvedValue(1);

    const response = await request(app).get('/api/goods?page=1&limit=10');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('goods');
    expect(response.body.goods).toHaveLength(1);
  });

  it('should return validation error for getGoodById', async () => {
    const response = await request(app).get('/api/goods/abc');
    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'Invalid value',
        }),
      ])
    );
  });

  it('should get good by id', async () => {
    goodModel.getGoodById.mockResolvedValue(mockGood);
    const response = await request(app).get('/api/goods/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockGood);
  });

  it('should return 404 for non-existing good', async () => {
    goodModel.getGoodById.mockRejectedValue({ code: 0 });

    const response = await request(app).get('/api/goods/999');
    expect(response.status).toBe(404);
    expect(response.text).toBe('Good not found');
  });

  it('should create a new good', async () => {
    goodModel.createGood.mockResolvedValue(mockGood);

    const response = await request(app)
      .post('/api/goods')
      .send(mockGood);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockGood);
  });

  it('should return validation error for createGood', async () => {
    const response = await request(app)
      .post('/api/goods')
      .send({ ...mockGood, price: -10 });
    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'Price must be a number',
        }),
      ])
    );
  });

  it('should update a good', async () => {
    const updatedGood = { ...mockGood, name: 'Updated Good' };
    goodModel.updateGood.mockResolvedValue(updatedGood);
    const response = await request(app)
      .put('/api/goods/1')
      .send(updatedGood);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Good');
  });

  it('should return validation error for updateGood', async () => {
    const response = await request(app)
      .put('/api/goods/abc')
      .send({ name: 'Updated Good' });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'Invalid value',
        }),
      ])
    );
  });

  it('should delete a good', async () => {
    goodModel.deleteGood.mockResolvedValue();

    const response = await request(app).delete('/api/goods/1');
    expect(response.status).toBe(204);
  });

  it('should return validation error for deleteGood', async () => {
    const response = await request(app).delete('/api/goods/abc');
    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'Invalid value',
        }),
      ])
    );
  });
});
