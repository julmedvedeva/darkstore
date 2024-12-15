import React from "react";

export function GoodSelector({ goods, selectedGood, onSelectGood }) {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-gray-600 font-medium mb-2">Select Product:</label>
      <select
        value={selectedGood}
        onChange={(e) => onSelectGood(e.target.value)}
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
  );
}

export default GoodSelector;
