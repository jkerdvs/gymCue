// src/components/Cycle/CycleSetup.jsx
import React, { useState } from "react";

export default function CycleSetup({ onCycleStart }) {
  const [form, setForm] = useState({
    name: "Bulk Cycle 1",
    startDate: new Date().toISOString().split("T")[0],
    goalWeight: "",
    startingWeight: "",
    workoutsGoal: 40,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startCycle = () => {
    const newCycle = {
      ...form,
      currentWeight: Number(form.startingWeight),
      workoutsCompleted: 0,
      notes: [],
      stats: {},
    };
    localStorage.setItem("currentCycle", JSON.stringify(newCycle));
    onCycleStart(newCycle);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Start New Bulk Cycle</h2>

      <input
        type="text"
        name="name"
        placeholder="Cycle Name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      />

      <input
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      />

      <input
        type="number"
        name="startingWeight"
        placeholder="Starting Weight (lbs)"
        value={form.startingWeight}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      />

      <input
        type="number"
        name="goalWeight"
        placeholder="Goal Weight (lbs)"
        value={form.goalWeight}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      />

      <button
        onClick={startCycle}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Start Cycle
      </button>
    </div>
  );
}
