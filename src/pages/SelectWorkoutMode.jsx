// src/pages/SelectWorkoutMode.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function SelectWorkoutMode() {
  const navigate = useNavigate();

  return (
    <div className="p-6 flex flex-col h-full items-center justify-center">
      <h1 className="text-2xl font-semibold mb-10 text-center">
        Start Your Session
      </h1>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        <button
          onClick={() => navigate("/template-picker")}
          className="w-full py-4 bg-gray-800 text-white rounded-xl text-lg shadow active:scale-95"
        >
          Load Template
        </button>

        <button
          onClick={() =>
            navigate("/workout", { state: { mode: "new" } })
          }
          className="w-full py-4 bg-blue-600 text-white rounded-xl text-lg shadow active:scale-95"
        >
          Create New Workout
        </button>
      </div>
    </div>
  );
}
