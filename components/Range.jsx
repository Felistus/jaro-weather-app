import React from "react";

export default function RangeBar({ humidity }) {
  return (
    <div className="slider">
      <span className="flex justify-between w-full text-white text-xs px-1 mb-0 pb-0">
        <p>0</p>
        <p>50</p>
        <p>100</p>
      </span>
      <input
        disabled
        type="range"
        min="0"
        max="100"
        value={humidity}
        onChange={(e) => e}
        className="w-full  "
      />
    </div>
  );
}
