// src/components/ExerciseCard.jsx
import React from "react";

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
    const next = {
      ...exercise,
      sets: exercise.sets.filter((_, idx) => idx !== i),
    };
    onUpdate(next);
  };

  return (
    <div
      className={
        "bg-white rounded-lg p-3 shadow-sm border border-gray-200 transition-all " +
        (isPR ? "ring-2 ring-yellow-400 shadow-md" : "")
      }
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="font-semibold text-base sm:text-lg break-words">
            {exercise.name || "Unnamed Exercise"}
          </div>
          <div className="text-xs text-gray-500">
            {(exercise.sets || []).length} set(s)
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleCollapse}
            className="text-xs px-2 py-1 rounded border bg-gray-100"
          >
            {exercise.collapsed ? "Expand" : "Collapse"}
          </button>

          <button
            onClick={() => onRemove(exercise.id)}
            className="text-xs px-2 py-1 rounded border bg-red-50 text-red-600"
          >
            Remove
          </button>
        </div>
      </div>

      {/* BODY */}
      {!exercise.collapsed && (
        <div className="mt-3 space-y-3">
          {(exercise.sets || []).map((s, i) => (
            <div
              key={i}
              className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex flex-col gap-3"
            >
              {/* REPS / WEIGHT */}
              <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4">
                <input
                  value={s.reps}
                  onChange={(e) => updateSet(i, { reps: e.target.value })}
                  placeholder="Reps"
                  type="number"
                  min="0"
                  className="border p-2 rounded text-sm w-full bg-white"
                />

                <input
                  value={s.weight}
                  onChange={(e) => updateSet(i, { weight: e.target.value })}
                  placeholder="Weight"
                  type="number"
                  min="0"
                  className="border p-2 rounded text-sm w-full bg-white"
                />
              </div>

              {/* FORM */}
              <div className="flex items-center gap-3">
                <label className="text-xs text-gray-600 w-12">Form</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={s.form ?? 5}
                  onChange={(e) => updateSet(i, { form: Number(e.target.value) })}
                  className="flex-1"
                />
                <div className="w-6 text-right text-sm font-medium">
                  {s.form ?? 5}
                </div>
              </div>

              {/* REMOVE SET */}
              <button
                onClick={() => removeSet(i)}
                className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 border w-fit"
              >
                Remove Set
              </button>
            </div>
          ))}

          {/* ADD SET */}
          <button
            onClick={addSet}
            className="w-full bg-gray-100 border border-gray-300 text-sm py-2 rounded"
          >
            + Add Set
          </button>
        </div>
      )}
    </div>
  );
}


