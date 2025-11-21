// src/components/MiniChart.jsx
import React from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function MiniChart({ data = [] }) {
  // data: [{ date, weight }, ...] - recharts expects array
  if (!data || data.length === 0) {
    return <div className="text-xs text-gray-500">no history</div>;
  }

  // Normalize data (ensure date, weight)
  const chartData = data.map((d, i) => ({
    date: d.date || `#${i + 1}`,
    weight: Number(d.weight) || 0,
  }));

  return (
    <div style={{ width: "100%", height: 64 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" hide />
          <Tooltip />
          <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
