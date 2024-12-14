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
    <div className="my-10 max-w-screen-lg">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Order ID:</label>
          <input type="text" value={order.orderid} readOnly className="border rounded p-2" />
        </div>
        <div>
          <label>Total amount:</label>
          <input type="text" value={order.totalamount} readOnly className="border rounded p-2" />
        </div>
        <div>
          <label>Created At: </label>
          <input type="text" value={new Date(order.createdat).toLocaleDateString() || "Not specified"} readOnly className="border rounded p-2" />
        </div>
        {order.deletedat && (
          <div>
            <label>Deleted At: </label>
            <input type="text" value={order.deletedat} readOnly className="border rounded p-2" />
          </div>
        )}
        <h3>Goods:</h3>
        {goodsOrder?.map((good, index) => (
          <div key={good.ordersgoodsid} className="mb-4 border p-4">
            <div className="flex gap-2 mb-2">
              <label>Select Product:</label>
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
                  const selectedGood = goods.find(item => item.name === e.target.value);
                  console.log("selectedGood", { selectedGood, goods, eTV: e.target.value, goodsOrder });
                  const newUpdatedData = [...updatedData];
                  newUpdatedData[index] = { ...goodsOrder[index], quantity: +e.target.value, };
                  setUpdatedData(newUpdatedData);
                  const newGoods = [...goodsOrder];
                  newGoods[index].quantity = +e.target.value;
                  setGoodsOrder(newGoods);
                }}
                className="border rounded p-2"
              />
            </div>
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white rounded p-2">Save Changes</button>
      </form>
    </div>
  );
}

export default EditPage;
