// src/components/ExerciseCard.jsx
import React from "react";

/**
 * props:
 * - exercise: { id, name, sets: [{ reps, weight }], collapsed? }
 * - onUpdate(exercise)  => called with the updated exercise object
 * - onRemove(id)
 * - suggestedSets: array (optional) used to prefill new sets
 * - isPR: boolean - highlight if PR on save
 */
export default function ExerciseCard({ exercise, onUpdate, onRemove, suggestedSets = [], isPR = false }) {
  const toggleCollapse = () => {
    onUpdate({ ...exercise, collapsed: !exercise.collapsed });
  };

  const updateSet = (index, newSet) => {
    const next = { ...exercise, sets: [...(exercise.sets || [])] };
    next.sets[index] = { ...next.sets[index], ...newSet };
    onUpdate(next);
  };

  const addSet = () => {
    const newSet = suggestedSets.length > 0 ? suggestedSets[0] : { reps: "", weight: "" };
    const next = { ...exercise, sets: [...(exercise.sets || []), newSet] };
    onUpdate(next);
  };

  const removeSet = (i) => {
    const next = { ...exercise, sets: exercise.sets.filter((_, idx) => idx !== i) };
    onUpdate(next);
  };

  return (
    <div className={`bg-white rounded-xl p-3 shadow-sm ${isPR ? "ring-2 ring-yellow-400 animate-pulse" : ""}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{exercise.name || "Unnamed Exercise"}</div>
          <div className="text-xs text-gray-500">{(exercise.sets || []).length} set(s)</div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleCollapse} className="text-sm px-2 py-1 border rounded">
            {exercise.collapsed ? "Expand" : "Collapse"}
          </button>
          <button onClick={() => onRemove(exercise.id)} className="text-sm px-2 py-1 border rounded text-red-600">
            Remove
          </button>
        </div>
      </div>

      {!exercise.collapsed && (
        <div className="mt-3 space-y-2">
          <div className="space-y-2">
            {(exercise.sets || []).map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={s.reps}
                  onChange={(e) => updateSet(i, { reps: e.target.value })}
                  placeholder="reps"
                  type="number"
                  className="w-20 border p-1 rounded text-sm"
                />
                <input
                  value={s.weight}
                  onChange={(e) => updateSet(i, { weight: e.target.value })}
                  placeholder="weight"
                  type="number"
                  className="w-28 border p-1 rounded text-sm"
                />
                <button onClick={() => removeSet(i)} className="text-red-600 text-sm px-2">
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={addSet} className="flex-1 bg-gray-100 border p-2 rounded text-sm">
              + Add set
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
