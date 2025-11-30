// src/components/ExerciseCard.jsx
import React from "react";

/**
 * props:
 * - exercise: { id, name, sets: [{ reps, weight, form }], collapsed? }
 * - onUpdate(exercise)  => called with the updated exercise object
 * - onRemove(id)
 * - suggestedSets: array (optional) used to prefill new sets
 * - isPR: boolean - highlight if PR on save
 */
export default function ExerciseCard({
  exercise,
  onUpdate,
  onRemove,
  suggestedSets = [],
  isPR = false,
}) {
  const toggleCollapse = () => {
    onUpdate({ ...exercise, collapsed: !exercise.collapsed });
  };

  const updateSet = (index, newSet) => {
    const next = { ...exercise, sets: [...(exercise.sets || [])] };
    next.sets[index] = { ...next.sets[index], ...newSet };
    onUpdate(next);
  };

  const addSet = () => {
    const newSet =
      suggestedSets.length > 0
        ? { ...suggestedSets[0], form: suggestedSets[0].form ?? 5 }
        : { reps: "", weight: "", form: 5 };
    const next = { ...exercise, sets: [...(exercise.sets || []), newSet] };
    onUpdate(next);
  };

  const removeSet = (i) => {
    const next = { ...exercise, sets: exercise.sets.filter((_, idx) => idx !== i) };
    onUpdate(next);
  };

  return (
    <div
      className={
        "bg-white rounded-xl p-3 shadow-sm text-black " +
        (isPR ? "ring-2 ring-yellow-400 animate-pulse" : "")
      }
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-lg">{exercise.name || "Unnamed Exercise"}</div>
          <div className="text-xs text-gray-500">{(exercise.sets || []).length} set(s)</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleCollapse}
            className="text-sm px-2 py-1 border rounded bg-gray-100"
            aria-label="Toggle collapse"
          >
            {exercise.collapsed ? "Expand" : "Collapse"}
          </button>
          <button
            onClick={() => onRemove(exercise.id)}
            className="text-sm px-2 py-1 border rounded text-red-600 bg-red-50"
            aria-label="Remove exercise"
          >
            Remove
          </button>
        </div>
      </div>

      {!exercise.collapsed && (
        <div className="mt-3 space-y-3">
          <div className="space-y-2">
            {(exercise.sets || []).map((s, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2">
                  <input
                    value={s.reps}
                    onChange={(e) => updateSet(i, { reps: e.target.value })}
                    placeholder="reps"
                    type="number"
                    min="0"
                    className="w-20 border p-1 rounded text-sm bg-white text-black placeholder-gray-400"
                    aria-label={`Reps for set ${i + 1}`}
                  />
                  <input
                    value={s.weight}
                    onChange={(e) => updateSet(i, { weight: e.target.value })}
                    placeholder="weight"
                    type="number"
                    min="0"
                    className="w-28 border p-1 rounded text-sm bg-white text-black placeholder-gray-400"
                    aria-label={`Weight for set ${i + 1}`}
                  />
                </div>

                {/* Form slider 0-10 */}
                <div className="flex-1 flex items-center gap-3">
                  <label className="text-xs text-gray-600 w-12">Form</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={s.form ?? 5}
                    onChange={(e) => updateSet(i, { form: Number(e.target.value) })}
                    className="flex-1"
                    aria-label={`Form rating for set ${i + 1}`}
                  />
                  <div className="w-8 text-right text-sm font-medium">{s.form ?? 5}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeSet(i)}
                    className="text-red-600 text-sm px-2 py-1 rounded bg-red-50 border"
                    aria-label={`Remove set ${i + 1}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={addSet}
              className="flex-1 bg-gray-100 border p-2 rounded text-sm"
              aria-label="Add set"
            >
              + Add set
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

