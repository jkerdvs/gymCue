// src/components/ExercisePicker.jsx
import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  getExercises,
  searchExercises,
  saveExercise,
  removeExercise,
  EQUIPMENT_TYPES,
  MUSCLE_GROUPS,
  DEFAULT_VARIATIONS,
} from "../lib/exerciseBank";

/**
 * Props:
 * - onSelect(exercise)  => selected exercise object from bank
 * - allowCreate (bool)  => show inline create form (default true)
 * - placeholder (string)
 */
export default function ExercisePicker({
  onSelect,
  allowCreate = true,
  placeholder = "Search exercises (e.g. Bicep Curl)",
}) {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);

  // inline create form state
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
    if (!query) {
      setList(getExercises());
    } else {
      setList(searchExercises(query));
    }
  }, [query]);

  const variationOptions = useMemo(() => {
    return DEFAULT_VARIATIONS[form.equipmentType] || ["Standard"];
  }, [form.equipmentType]);

  const submitCreate = () => {
    if (!form.name || !form.name.trim()) return alert("Name required");
    const ex = {
      id: uuidv4(),
      name: form.name.trim(),
      equipmentType: form.equipmentType,
      variation: form.variation || (variationOptions[0] || "Standard"),
      muscleGroup: form.muscleGroup || "Other",
      userCreated: true,
    };
    saveExercise(ex);
    setList((p) => [ex, ...p]);
    setForm({ name: "", equipmentType: "Dumbbell", variation: "", muscleGroup: "Biceps" });
    setCreating(false);
    setOpen(false);
    onSelect && onSelect(ex);
  };

  const handleSelect = (ex) => {
    setOpen(false);
    onSelect && onSelect(ex);
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this exercise from your bank?")) return;
    removeExercise(id);
    setList(getExercises());
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
          aria-label="Search exercises"
        />
        <button
          onClick={() => {
            setOpen((s) => !s);
            setQuery("");
            setList(getExercises());
          }}
          className="px-3 py-2 rounded bg-gray-100 border text-sm"
          aria-label="Open picker"
          title="Open exercise bank"
        >
          {open ? "Close" : "Pick"}
        </button>
      </div>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border rounded shadow-lg p-3 max-h-72 overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Exercise Bank</div>
            <div className="text-xs text-gray-500">{list.length} results</div>
          </div>

          <div className="space-y-2">
            {list.map((ex) => (
              <div
                key={ex.id}
                className="flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-50"
              >
                <div>
                  <div className="font-medium text-sm">{ex.name}</div>
                  <div className="text-xs text-gray-500">
                    {ex.equipmentType} • {ex.variation} • {ex.muscleGroup}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSelect(ex)}
                    className="px-2 py-1 rounded bg-blue-600 text-white text-sm"
                  >
                    Add
                  </button>

                  {ex.userCreated && (
                    <button
                      onClick={() => handleDelete(ex.id)}
                      className="px-2 py-1 rounded border text-sm text-red-600 bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}

            {list.length === 0 && <div className="text-xs text-gray-500">No matches</div>}
          </div>

          {allowCreate && (
            <div className="mt-3 border-t pt-3">
              {!creating ? (
                <button
                  onClick={() => setCreating(true)}
                  className="w-full px-3 py-2 rounded bg-green-600 text-white text-sm"
                >
                  + Create New Exercise
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Exercise name (e.g. Bicep Curl)"
                      className="border rounded px-2 py-2 text-sm"
                    />
                    <select
                      value={form.equipmentType}
                      onChange={(e) =>
                        setForm({ ...form, equipmentType: e.target.value, variation: "" })
                      }
                      className="border rounded px-2 py-2 text-sm"
                    >
                      {EQUIPMENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>

                    <select
                      value={form.variation || ""}
                      onChange={(e) => setForm({ ...form, variation: e.target.value })}
                      className="border rounded px-2 py-2 text-sm"
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
                      className="border rounded px-2 py-2 text-sm"
                    >
                      {MUSCLE_GROUPS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
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
      )}
    </div>
  );
}
