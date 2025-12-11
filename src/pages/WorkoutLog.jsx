// src/pages/WorkoutLog.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function WorkoutLog() {
  const navigate = useNavigate();

  return (
    <div className="p-6 flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-semibold mb-8 text-center">Lift</h1>

      <button
        onClick={() => navigate("/select-workout-mode")}
        className="px-6 py-4 bg-blue-600 text-white rounded-xl text-xl shadow-md active:scale-95"
      >
        BEGIN
      </button>
    </div>
  );
}



