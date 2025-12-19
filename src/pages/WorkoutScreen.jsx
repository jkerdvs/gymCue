// src/pages/WorkoutScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExercisePicker from "../components/ExercisePicker";
import { getExercises } from "../lib/exercises";
import { saveWorkout } from "../lib/workouts";

export default function SimpleWorkout() {
  const navigate = useNavigate();
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([]);

  const handleAddExercise = (exercise) => {
    setExercises((prev) => [...prev, { ...exercise, sets: [] }]);
  };

  const addSet = (idx) => {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === idx
          ? { ...ex, sets: [...(ex.sets || []), { weight: 0, reps: 0 }] }
          : ex
      )
    );
  };

  const updateSet = (exIdx, setIdx, field, value) => {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === exIdx
          ? {
              ...ex,
              sets: ex.sets.map((s, j) =>
                j === setIdx ? { ...s, [field]: value } : s
              ),
            }
          : ex
      )
    );
  };

  const handleSaveWorkout = () => {
    if (!workoutName.trim()) return alert("Workout needs a name!");
    saveWorkout({ name: workoutName, exercises });
    alert("Workout saved!");
    navigate("/progress"); // redirect to progress page
  };

  return (
    <div className="p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">New Workout</h1>

      <input
        className="w-full p-2 border rounded mb-4 text-black"
        placeholder="Workout Name"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
      />

      <ExercisePicker onSelect={handleAddExercise} />

      <div className="mt-4 space-y-4 text-black">
        {exercises.map((ex, exIdx) => (
          <div key={ex.id} className="p-3 bg-gray-100 rounded text-black">
            <h2 className="font-semibold text-black">{ex.name}</h2>

            {(ex.sets || []).map((s, sIdx) => (
              <div key={sIdx} className="flex gap-2 my-2 text-black">
                <input
                  type="number"
                  placeholder="Weight"
                  value={s.weight}
                  onChange={(e) => updateSet(exIdx, sIdx, "weight", Number(e.target.value))}
                  className="border p-1 rounded w-1/2 text-black"
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={s.reps}
                  onChange={(e) => updateSet(exIdx, sIdx, "reps", Number(e.target.value))}
                  className="border p-1 rounded w-1/2"
                />
              </div>
            ))}

            <button
              onClick={() => addSet(exIdx)}
              className="px-2 py-1 bg-blue-500 text-white rounded mt-1"
            >
              Add Set
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSaveWorkout}
        className="mt-6 w-full py-3 bg-green-600 text-white rounded"
      >
        Save Workout
      </button>
    </div>
  );
}






