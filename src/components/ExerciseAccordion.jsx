import React, { useState, useRef, useEffect } from "react";
import EditExerciseModal from "./EditExerciseModal";
import { createExercise } from "../lib/exerciseBank";

export default function ExerciseAccordion({
  muscle,
  exercises,
  removeExercise,
  refresh,
}) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef(null);

  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    if (open) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [open, exercises]);

  // Toggle favorites
  const toggleFavorite = (ex) => {
    const updated = { ...ex, favorite: !ex.favorite };
    createExercise(updated);
    refresh();
  };

  return (
    <div className="border rounded-md bg-white shadow-sm">
      {/* HEADER */}
      <button
        className="w-full flex justify-between items-center p-3 text-left font-semibold text-black"
        onClick={() => setOpen((o) => !o)}
      >
        {muscle}
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>

      {/* ACCORDION BODY */}
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div className="p-3 space-y-3">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className="p-3 border rounded flex justify-between items-center bg-gray-50"
            >
              <div>
                <p className="font-semibold">{ex.name}</p>
                <p className="text-sm text-gray-500">
                  {ex.equipmentType} • {ex.muscleGroup}
                </p>
              </div>

              <div className="flex gap-3 items-center">
                {/* FAVORITE STAR */}
                <button
                  className={`text-xl transition-all ${
                    ex.favorite ? "text-yellow-400 scale-110" : "text-gray-400"
                  }`}
                  onClick={() => toggleFavorite(ex)}
                >
                  ★
                </button>

                {/* EDIT */}
                <button
                  className="text-blue-600 font-semibold"
                  onClick={() => setEditTarget(ex)}
                >
                  Edit
                </button>

                {/* DELETE */}
                <button
                  className="text-red-600 font-semibold"
                  onClick={() => {
                    removeExercise(ex.id);
                    refresh();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL RENDER HERE */}
      {editTarget && (
        <EditExerciseModal
          exercise={editTarget}
          close={() => setEditTarget(null)}
          update={(updated) => {
            createExercise(updated);
            refresh();
            setEditTarget(null);
          }}
        />
      )}
    </div>
  );
}
