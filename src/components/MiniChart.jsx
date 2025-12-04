// src/components/MiniChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MiniChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-xs text-gray-400 py-2">
        no history
      </div>
    );
  }

  const chartData = data.map((d, i) => ({
    date: d.date || `#${i + 1}`,
    weight: Number(d.weight) || 0,
  }));

  return (
    <div className="w-full h-20 sm:h-24 bg-gray-50 border border-gray-200 rounded-lg p-1">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" hide />
          <Tooltip
            contentStyle={{
              fontSize: "0.7rem",
              borderRadius: "6px",
            }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#34d399"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

