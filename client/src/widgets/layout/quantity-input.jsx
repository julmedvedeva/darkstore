import React from "react";

export function QuantityInput({ quantity, onChangeQuantity }) {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-gray-600 font-medium mb-2">Quantity:</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => onChangeQuantity(+e.target.value)}
        className="border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default QuantityInput;
