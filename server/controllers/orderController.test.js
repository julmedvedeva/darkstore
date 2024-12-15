const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const OrderController = require('../controllers/order.controller'); // Путь к вашему контроллеру
const app = express();

app.use(bodyParser.json());
app.post('/orders', OrderController.createOrder);
app.get('/orders', OrderController.getAllOrders);
app.get('/orders/:id', OrderController.getOrderById);
app.put('/orders/:id', OrderController.updateOrder);
app.delete('/orders/:id', OrderController.deleteOrder);

describe('OrderController', () => {
  // Здесь вы можете использовать моковые данные для тестирования
  const mockOrder = {
    totalamount: 100.00,
    goods: [
      { goodid: 1, goodname: 'Good 1', quantity: 2 },
      { goodid: 2, goodname: 'Good 2', quantity: 1 },
    ],
  };

  it('should create a new order', async () => {
    const response = await request(app)
      .post('/orders')
      .send(mockOrder);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('orderid');
    expect(response.body.totalamount).toBe(mockOrder.totalamount);
    expect(response.body.goods).toHaveLength(mockOrder.goods.length);
  });

  it('should return validation error for totalamount', async () => {
    const response = await request(app)
      .post('/orders')
      .send({ ...mockOrder, totalamount: -10 });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'Total amount must be a number greater than zero',
        }),
      ])
    );
  });

  it('should return validation error for goods', async () => {
    const response = await request(app)
      .post('/orders')
      .send({ ...mockOrder, goods: [{ goodid: 1, goodname: 'Good 1', quantity: 0 }] });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'Quantity must be a positive integer',
        }),
      ])
    );
  });

  it('should get all orders', async () => {
    const response = await request(app).get('/orders');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('orders');
  });

  it('should get order by id', async () => {
    const response = await request(app).get('/orders/1'); // Предполагаем, что заказ с ID 1 существует
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('orderid');
  });

  it('should update an order', async () => {
    const response = await request(app)
      .put('/orders/1') // Предполагаем, что заказ с ID 1 существует
      .send({ totalamount: 150.00 });

    expect(response.status).toBe(200);
    expect(response.body.totalamount).toBe(150.00);
  });

  it('should delete an order', async () => {
    const response = await request(app).delete('/orders/1'); // Предполагаем, что заказ с ID 1 существует
    expect(response.status).toBe(204);
  });
});
