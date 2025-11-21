import React, { useEffect, useState } from "react";
import { getWorkouts } from "../lib/storage";
import {
  LineChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function Progress() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ total: 0, best: 0, change: 0 });

  useEffect(() => {
    const workouts = getWorkouts() || [];

    const chartData = workouts.map((w) => {
      const volume = (w.exercises || []).reduce((sum, ex) => {
        const exerciseVolume = (ex.sets || []).reduce(
          (setSum, s) =>
            setSum + (Number(s.reps) || 0) * (Number(s.weight) || 0),
          0
        );
        return sum + exerciseVolume;
      }, 0);

      const points = (volume / 100) * 1.0;
      return { date: w.date, volume, points };
    });

    let runningTotal = 0;
    const wealthData = chartData.map((d) => {
      runningTotal += d.points;
      return { ...d, wealth: runningTotal };
    });

    setData(wealthData);

    const total = wealthData.reduce((a, b) => a + b.points, 0);
    const best = Math.max(...wealthData.map((d) => d.points), 0);
    const recent = wealthData.slice(-14);
    const week1 = recent.slice(-7).reduce((a, b) => a + b.points, 0);
    const week2 = recent.slice(-14, -7).reduce((a, b) => a + b.points, 0);
    const change = week2 ? (((week1 - week2) / week2) * 100).toFixed(1) : 0;

    setStats({ total, best, change });
  }, []);

  return (
    <div className="relative p-6 min-h-screen bg-[#0A0F1E] text-gray-100 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-chartBlue/10 via-chartPurple/5 to-chartCyan/10 blur-3xl opacity-60 pointer-events-none" />

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-semibold mb-6 relative z-10"
      >
        Work Portfolio 📈
      </motion.h1>

      {/* --- Stats --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 relative z-10">
        {[
          { label: "Total Work-Points", value: stats.total, suffix: " pts" },
          { label: "Best Session", value: stats.best, suffix: " pts" },
          {
            label: "7-Day Growth",
            value: stats.change,
            suffix: "%",
            color: stats.change >= 0 ? "text-chartGreen" : "text-chartCoral",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/10"
          >
            <p className="text-sm text-gray-300 mb-1">{s.label}</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={s.value}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className={`text-xl font-semibold ${s.color || "text-chartCyan"}`}
              >
                {Number.isFinite(s.value)
                  ? s.value.toLocaleString() + s.suffix
                  : `0${s.suffix}`}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* --- Chart --- */}
      <div className="relative w-full h-[360px] -mt-2 rounded-2xl overflow-hidden">
        {/* Glowing panel background */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.12), transparent 70%)",
            mixBlendMode: "screen",
          }}
        />

        <ResponsiveContainer
          width="100%"
          height="100%"
          style={{ background: "transparent" }}
          className="bg-transparent"
        >
          <LineChart
            data={data}
            style={{ background: "transparent" }}
            className="bg-transparent"
          >
            <defs>
              <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                <stop offset="50%" stopColor="#06B6D4" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#A855F7" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tickMargin={10} />
            <YAxis stroke="rgba(255,255,255,0.4)" tickMargin={10} />

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15,23,42,0.9)",
                border: "1px solid rgba(59,130,246,0.3)",
                borderRadius: "10px",
              }}
              labelStyle={{ color: "#e0e7ff" }}
              itemStyle={{ color: "#a5f3fc" }}
            />

            <Area
              type="monotone"
              dataKey="wealth"
              stroke="url(#wealthGradient)"
              fill="url(#wealthGradient)"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#3B82F6",
                stroke: "#06B6D4",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}



