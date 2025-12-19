import React, { useEffect, useState } from "react";
import { getExercises } from "../lib/exerciseBank";

/**
 * Props:
 * - onSelect(exercise) => adds selected exercise to workout
 * - placeholder (string)
 */
export default function ExercisePicker({ onSelect, placeholder = "Search exercises..." }) {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setList(getExercises()); // only load exercises from the bank
  }, []);

  // Filter list by query
  const filtered = list.filter((ex) =>
    ex.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <input
        className="w-full border rounded px-3 py-2 text-sm"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
      />

      {open && filtered.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border rounded shadow-lg p-3 max-h-72 overflow-auto">
          {filtered.map((ex) => (
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
                onClick={() => { onSelect(ex); setOpen(false); }}
                className="px-2 py-1 rounded bg-blue-600 text-white text-sm"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



