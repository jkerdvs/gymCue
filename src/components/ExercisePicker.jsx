// src/components/ExercisePicker.jsx
import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  getExercises,
  createExercise,
  EQUIPMENT_TYPES,
  MUSCLE_GROUPS,
  DEFAULT_VARIATIONS,
} from "../lib/exerciseBank";

/**
 * Props:
 * - onSelect(exercise) => adds selected exercise to workout
 * - placeholder (string)
 */
export default function ExercisePicker({ onSelect, placeholder = "Search exercises..." }) {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);

  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    equipmentType: "Dumbbell",
    variation: "",
    muscleGroup: "Biceps",
  });

  useEffect(() => {
    setList(getExercises());
  }, []);

  useEffect(() => {
    if (!query) setList(getExercises());
    else
      setList(
        getExercises().filter((ex) =>
          ex.name.toLowerCase().includes(query.toLowerCase())
        )
      );
  }, [query]);

  const variationOptions = useMemo(() => {
    return DEFAULT_VARIATIONS[form.equipmentType] || ["Standard"];
  }, [form.equipmentType]);

  const submitCreate = () => {
    if (!form.name || !form.name.trim()) return alert("Name required");

    const newEx = {
      id: uuidv4(),
      name: form.name.trim(),
      equipmentType: form.equipmentType,
      variation: form.variation || variationOptions[0],
      muscleGroup: form.muscleGroup || "Other",
      userCreated: true,
    };

    createExercise(newEx); // Add to bank
    setList((p) => [newEx, ...p]);

    onSelect(newEx); // Add to workout
    setForm({ name: "", equipmentType: "Dumbbell", variation: "", muscleGroup: "Biceps" });
    setCreating(false);
    setOpen(false);
  };

  const handleSelect = (ex) => {
    onSelect(ex);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 text-sm"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        <button
          onClick={() => setOpen((s) => !s)}
          className="px-3 py-2 rounded bg-gray-100 border text-sm"
        >
          {open ? "Close" : "Pick"}
        </button>
      </div>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border rounded shadow-lg p-3 max-h-72 overflow-auto">
          {list.map((ex) => (
            <div
              key={ex.id}
              className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
            >
              <div>
                <div className="font-medium text-sm">{ex.name}</div>
                <div className="text-xs text-gray-500">
                  {ex.equipmentType} • {ex.variation} • {ex.muscleGroup}
                </div>
              </div>
              <button
                onClick={() => handleSelect(ex)}
                className="px-2 py-1 rounded bg-blue-600 text-white text-sm"
              >
                Add
              </button>
            </div>
          ))}

          {!creating ? (
            <button
              onClick={() => setCreating(true)}
              className="w-full mt-2 px-3 py-2 rounded bg-green-600 text-white text-sm"
            >
              + Create New Exercise
            </button>
          ) : (
            <div className="space-y-2 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Exercise name"
                  className="border rounded px-2 py-2 text-sm"
                />
                <select
                  value={form.equipmentType}
                  onChange={(e) => setForm({ ...form, equipmentType: e.target.value, variation: "" })}
                  className="border rounded px-2 py-2 text-sm"
                >
                  {EQUIPMENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <select
                  value={form.variation || ""}
                  onChange={(e) => setForm({ ...form, variation: e.target.value })}
                  className="border rounded px-2 py-2 text-sm"
                >
                  <option value="">Select variation</option>
                  {variationOptions.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                <select
                  value={form.muscleGroup}
                  onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })}
                  className="border rounded px-2 py-2 text-sm"
                >
                  {MUSCLE_GROUPS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={submitCreate}
                  className="flex-1 px-3 py-2 rounded bg-blue-600 text-white text-sm"
                >
                  Create & Add
                </button>
                <button
                  onClick={() => setCreating(false)}
                  className="px-3 py-2 rounded border text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


