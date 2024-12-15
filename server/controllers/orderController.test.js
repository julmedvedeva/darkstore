const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const OrderController = require('../controllers/order.controller'); // Путь к вашему контроллеру
const orderModel = require('../models/order.model');
const orderGoodsModel = require('../models/orderGoods.model');
const app = express();
jest.mock('../models/order.model');
jest.mock('../models/orderGoods.model');

app.use(bodyParser.json());
app.post('/api/orders', OrderController.createOrder);
app.get('/api/orders', OrderController.getAllOrders);
app.get('/api/orders/:id', OrderController.getOrderById);
app.put('/api/orders/:id', OrderController.updateOrder);
app.delete('/api/orders/:id', OrderController.deleteOrder);

describe('OrderController', () => {
  const mockOrder = {
    orderid: 1,
    totalamount: 100.90,
    goods: [
      {
        goodid: 10,
        quantity: 50,
        goodname: "Peach"
      }
    ]
  };

  it('should create a new order', async () => {
    orderModel.createOrder.mockResolvedValue(mockOrder);

    const response = await request(app)
      .post('/api/orders')
      .send(mockOrder);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('orderid');
    expect(response.body.totalamount).toBe(mockOrder.totalamount);
    expect(response.body.goods).toHaveLength(mockOrder.goods.length);
  });

  it('should return validation error for totalamount', async () => {
    const updatedMock = { ...mockOrder, totalamount: -10 };
    const response = await request(app)
      .post('/api/orders')
      .send(updatedMock);
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
      .post('/api/orders')
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
    orderModel.getAllOrders.mockResolvedValue([
      { orderid: 1, totalamount: 100.90 },
      { orderid: 2, totalamount: 200.00 },
    ]);
    orderModel.getTotalOrdersCount.mockResolvedValue(2);
    orderGoodsModel.getOrderById.mockImplementation(async (orderId) => {
      if (orderId === 1) {
        return [{ goodid: 10, quantity: 50, goodname: 'Peach' }];
      }
      if (orderId === 2) {
        return [{ goodid: 20, quantity: 30, goodname: 'Apple' }];
      }
      return [];
    });

    const response = await request(app).get('/api/orders?page=1&limit=10');

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('orders');

    expect(response.body.orders).toEqual([
      {
        orderid: 1,
        totalamount: 100.90,
        goods: [{ goodid: 10, quantity: 50, goodname: 'Peach' }],
      },
      {
        orderid: 2,
        totalamount: 200.00,
        goods: [{ goodid: 20, quantity: 30, goodname: 'Apple' }],
      },
    ]);

    expect(response.body.pagination).toEqual({
      totalOrders: 2,
      totalPages: 1,
      currentPage: 1,
      limit: 10,
    });

    expect(orderModel.getAllOrders).toHaveBeenCalledWith(10, 0);
    expect(orderModel.getTotalOrdersCount).toHaveBeenCalled();
    expect(orderGoodsModel.getOrderById).toHaveBeenCalledWith(1);
    expect(orderGoodsModel.getOrderById).toHaveBeenCalledWith(2);
  });

  it('should get order by id', async () => {
    orderModel.getOrderById.mockResolvedValue(mockOrder);
    orderGoodsModel.getOrderById.mockResolvedValue(mockOrder.goods);

    const response = await request(app).get('/api/orders/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrder);
  });


  it('should update an order', async () => {
    const updatedMock = { ...mockOrder, totalamount: 150.00 }
    orderModel.updateOrder.mockResolvedValue(updatedMock);
    const response = await request(app)
      .put('/api/orders/1')
      .send(updatedMock);

    expect(response.status).toBe(200);
    expect(response.body.totalamount).toBe(150.00);
  });

  it('should delete an order', async () => {
    const response = await request(app).delete('/api/orders/1');
    expect(response.status).toBe(204);
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
});
