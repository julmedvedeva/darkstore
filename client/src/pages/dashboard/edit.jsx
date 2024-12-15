import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { goodsManager, orderManager } from "@/data";

export function EditPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [goodsOrder, setGoodsOrder] = useState([]);
  const [goods, setGoods] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);

  if (!id) return <div>Loading...</div>;

  useEffect(() => {
    fetchOrder(id);
    fetchGoods();
  }, [id]);

  const fetchOrder = useCallback((currentId) => {
    orderManager.getOrderById(currentId).then(() => {
      setOrder(orderManager.order);
      setGoodsOrder(orderManager.order.goods);
      setUpdatedData(orderManager.order.goods.map((good) => ({ goodid: good.goodid, quantity: good.quantity, goodname: good.goodname, orderid: good.orderid, ordersgoodsid: good.ordersgoodsid })));
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const fetchGoods = useCallback(() => {
    goodsManager.fetchAllGoods().then(() => {
      setGoods(goodsManager.goods);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated data:", { order, goods: updatedData });
    orderManager.updateOrder(order.orderid, { ...order, goods: updatedData }).then((data) => {
      console.log("data", data);
    }).catch((err) => {
      console.log(err);
    });
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="my-10 max-w-screen-lg mx-auto p-6 bg-gray-50 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Edit Order</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">Order ID:</label>
          <input type="text" value={order.orderid} readOnly className="border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">Total Amount:</label>
          <input type="text" value={order.totalamount} readOnly className="border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">Created At:</label>
          <input type="text" value={new Date(order.createdat).toLocaleDateString() || "Not specified"} readOnly className="border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {order.deletedat && (
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-2">Deleted At:</label>
            <input type="text" value={order.deletedat} readOnly className="border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-700">Goods:</h3>
        {goodsOrder?.map((good, index) => (
          <div key={good.ordersgoodsid} className="mb-4 border border-gray-300 p-4 rounded-lg bg-white shadow-sm">
            <div className="flex flex-col mb-4">
              <label className="text-gray-600 font-medium mb-2">Select Product:</label>
              <select
                value={good.goodname}
                onChange={(e) => {
                  const selectedGood = goods.find(item => item.name === e.target.value);
                  const newUpdatedData = [...updatedData];
                  newUpdatedData[index] = { goodid: selectedGood.goodid, quantity: good.quantity, goodname: selectedGood.name, orderid: good.orderid, ordersgoodsid: good.ordersgoodsid };
                  setUpdatedData(newUpdatedData);
                  const newGoods = [...goodsOrder];
                  newGoods[index].goodname = selectedGood.name;
                  newGoods[index].goodid = selectedGood.goodid;
                  newGoods[index].ordersgoodsid = good.ordersgoodsid;
                  setGoodsOrder(newGoods);
                }}
                className="border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Product</option>
                {goods.map((item) => (
                  <option key={item.goodid} value={item.name}>{item.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-gray-600 font-medium mb-2">Quantity:</label>
              <input
                type="number"
                value={good.quantity}
                onChange={(e) => {
                  const newUpdatedData = [...updatedData];
                  newUpdatedData[index] = { ...goodsOrder[index], quantity: +e.target.value };
                  setUpdatedData(newUpdatedData);
                  const newGoods = [...goodsOrder];
                  newGoods[index].quantity = +e.target.value;
                  setGoodsOrder(newGoods);
                }}
                className="border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPage;
