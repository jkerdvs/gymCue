// src/pages/ExerciseBank.jsx
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  getExercises,
  saveExercise,
  removeExercise,
  EQUIPMENT_TYPES,
  MUSCLE_GROUPS,
  DEFAULT_VARIATIONS,
} from "../lib/exerciseBank";

/**
 * Simple management page for the Exercise Bank.
 * - View, add, delete exercises
 * - Local-only (localStorage)
 */
export default function ExerciseBankPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    equipmentType: "Dumbbell",
    variation: "",
    muscleGroup: "Biceps",
  });

  useEffect(() => {
    setList(getExercises());
  }, []);

  const variationOptions = DEFAULT_VARIATIONS[form.equipmentType] || ["Standard"];

  const handleSave = () => {
    if (!form.name || !form.name.trim()) return alert("Name required");
    const ex = {
      id: uuidv4(),
      name: form.name.trim(),
      equipmentType: form.equipmentType,
      variation: form.variation || variationOptions[0] || "Standard",
      muscleGroup: form.muscleGroup,
      userCreated: true,
    };
    saveExercise(ex);
    setList(getExercises());
    setForm({ name: "", equipmentType: "Dumbbell", variation: "", muscleGroup: "Biceps" });
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this exercise?")) return;
    removeExercise(id);
    setList(getExercises());
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Exercise Bank</h1>
        <p className="text-sm text-gray-600">Create and manage your exercise templates.</p>
      </div>

      <div className="bg-gray-50 p-3 rounded shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Exercise name"
            className="border rounded px-2 py-2"
          />
          <select
            value={form.equipmentType}
            onChange={(e) => setForm({ ...form, equipmentType: e.target.value, variation: "" })}
            className="border rounded px-2 py-2"
          >
            {EQUIPMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={form.variation}
            onChange={(e) => setForm({ ...form, variation: e.target.value })}
            className="border rounded px-2 py-2"
          >
            <option value="">Select variation</option>
            {variationOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <select
            value={form.muscleGroup}
            onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })}
            className="border rounded px-2 py-2"
          >
            {MUSCLE_GROUPS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={handleSave} className="px-3 py-2 rounded bg-blue-600 text-white">
            Add Exercise
          </button>
          <button
            onClick={() => setForm({ name: "", equipmentType: "Dumbbell", variation: "", muscleGroup: "Biceps" })}
            className="px-3 py-2 rounded border"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {list.map((ex) => (
          <div key={ex.id} className="flex items-center justify-between p-3 bg-white rounded shadow-sm">
            <div>
              <div className="font-medium">{ex.name}</div>
              <div className="text-xs text-gray-500">
                {ex.equipmentType} • {ex.variation} • {ex.muscleGroup} {ex.userCreated ? "• custom" : ""}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(JSON.stringify(ex, null, 2));
                  alert("Copied exercise JSON to clipboard");
                }}
                className="px-2 py-1 border rounded text-sm"
              >
                Copy
              </button>
              <button
                onClick={() => handleDelete(ex.id)}
                className="px-2 py-1 border rounded text-sm text-red-600 bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
