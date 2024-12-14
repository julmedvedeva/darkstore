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
    goodsManager.fetchAllGoods().then(() => {
      setGoods(goodsManager.goods);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New order data:", newOrder);
    orderManager.createOrder(newOrder).then((data) => {
      console.log("Order created", data);
      navigate(`/dashboard/orders/${data.orderid}/edit/`);
    }).catch((err) => {
      console.log(err);
    });
  };

  const handleAddGood = () => {
    setGoodsOrder([...goodsOrder, { goodid: "", quantity: 1, goodname: "" }]);
  };

  return (
    <div className="my-10 max-w-screen-lg">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Total amount:</label>
          <input
            type="number"
            value={newOrder.totalamount}
            onChange={(e) => setNewOrder({ ...newOrder, totalamount: +e.target.value })}
            className="border rounded p-2"
          />
        </div>
        <h3>Goods:</h3>
        {goodsOrder.map((good, index) => (
          <div key={index} className="mb-4 border p-4">
            <div className="flex gap-2 mb-2">
              <label>Select Product:</label>
              <select
                value={good.goodname}
                onChange={(e) => {
                  const selectedGood = goods.find(item => item.name === e.target.value);
                  const newGoodsOrder = [...goodsOrder];
                  newGoodsOrder[index] = { goodid: selectedGood.goodid, quantity: good.quantity, goodname: selectedGood.name };
                  setGoodsOrder(newGoodsOrder);
                  setNewOrder({ ...newOrder, goods: newGoodsOrder });
                }}
                className="border rounded p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Product</option>
                {goods.map((item) => (
                  <option key={item.goodid} value={item.name}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <label>Quantity:</label>
              <input
                type="number"
                value={good.quantity}
                onChange={(e) => {
                  const newGoodsOrder = [...goodsOrder];
                  newGoodsOrder[index].quantity = +e.target.value;
                  setGoodsOrder(newGoodsOrder);
                  setNewOrder({ ...newOrder, goods: newGoodsOrder });
                }}
                className="border rounded p-2"
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAddGood} className="bg-green-500 text-white rounded p-2">Add Good</button>
        <button type="submit" className="bg-blue-500 text-white rounded p-2">Create Order</button>
      </form>
    </div>
  );
}

export default CreatePage;
