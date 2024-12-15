import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { goodsManager, orderManager } from "@/data";
import { GoodSelector, QuantityInput } from "@/widgets/layout";

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
            step={'0.01'}
            value={newOrder.totalamount}
            onChange={(e) => setNewOrder({ ...newOrder, totalamount: +e.target.value })}
            className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${newOrder.totalamount === 0 ? "border-red-500" : ""
              }`}
          />
          {newOrder.totalamount <= 0 && (
            <p className="text-red-500 text-sm">Total amount cannot be zero.</p>
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-700">Goods:</h3>
        {goodsOrder.map((good, index) => (
          <div
            key={index}
            className="mb-4 border border-gray-300 p-4 rounded-lg bg-white shadow-sm"
          >
            <GoodSelector
              goods={goods}
              selectedGood={good.goodname}
              onSelectGood={(value) => {
                const selectedGood = goods.find((item) => item.name === value);
                const newGoodsOrder = [...goodsOrder];
                newGoodsOrder[index] = {
                  goodid: selectedGood.goodid,
                  quantity: good.quantity,
                  goodname: selectedGood.name,
                };
                setGoodsOrder(newGoodsOrder);
                setNewOrder({ ...newOrder, goods: newGoodsOrder });
              }}
            />
            <QuantityInput
              quantity={good.quantity}
              onChangeQuantity={(value) => {
                const newGoodsOrder = [...goodsOrder];
                newGoodsOrder[index].quantity = value;
                setGoodsOrder(newGoodsOrder);
                setNewOrder({ ...newOrder, goods: newGoodsOrder });
              }}
            />
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
            disabled={!newOrder.goods.length}
            className={`${!newOrder.goods.length
              ? "bg-blue-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              } px-4 py-2 rounded-lg`}
          >
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePage;
