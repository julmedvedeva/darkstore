import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { goodsManager, orderManager } from "@/data";

export function CreatePage() {
  const navigate = useNavigate();
  const [goodsOrder, setGoodsOrder] = useState([]);
  const [goods, setGoods] = useState([]);
  const [newOrder, setNewOrder] = useState({ totalamount: 0, goods: [] });

  useEffect(() => {
    fetchGoods();
  }, []);

  const fetchGoods = useCallback(() => {
    goodsManager
      .fetchAllGoods()
      .then(() => {
        setGoods(goodsManager.goods);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New order data:", newOrder);
    orderManager
      .createOrder(newOrder)
      .then((data) => {
        console.log("Order created", data);
        navigate(`/dashboard/orders/${data.orderid}/edit/`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddGood = () => {
    setGoodsOrder([...goodsOrder, { goodid: "", quantity: 1, goodname: "" }]);
  };

  return (
    <div className="my-10 max-w-screen-lg mx-auto p-6 bg-gray-50 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Create New Order</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">Total Amount:</label>
          <input
            type="number"
            value={newOrder.totalamount}
            onChange={(e) => setNewOrder({ ...newOrder, totalamount: +e.target.value })}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <h3 className="text-xl font-semibold text-gray-700">Goods:</h3>
        {goodsOrder.map((good, index) => (
          <div
            key={index}
            className="mb-4 border border-gray-300 p-4 rounded-lg bg-white shadow-sm"
          >
            <div className="flex flex-col mb-4">
              <label className="text-gray-600 font-medium mb-2">Select Product:</label>
              <select
                value={good.goodname}
                onChange={(e) => {
                  const selectedGood = goods.find(
                    (item) => item.name === e.target.value
                  );
                  const newGoodsOrder = [...goodsOrder];
                  newGoodsOrder[index] = {
                    goodid: selectedGood.goodid,
                    quantity: good.quantity,
                    goodname: selectedGood.name,
                  };
                  setGoodsOrder(newGoodsOrder);
                  setNewOrder({ ...newOrder, goods: newGoodsOrder });
                }}
                className="border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Product</option>
                {goods.map((item) => (
                  <option key={item.goodid} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-2">Quantity:</label>
              <input
                type="number"
                value={good.quantity}
                onChange={(e) => {
                  const newGoodsOrder = [...goodsOrder];
                  newGoodsOrder[index].quantity = +e.target.value;
                  setGoodsOrder(newGoodsOrder);
                  setNewOrder({ ...newOrder, goods: newGoodsOrder });
                }}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleAddGood}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Add Good
          </button>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePage;
