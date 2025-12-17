// src/pages/WorkoutScreen.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SaveTemplateModal from "../components/SaveTemplateModal";
import ExercisePicker from "../components/ExercisePicker";
import { getExercises, createExercise } from "../lib/exerciseBank";

export default function WorkoutScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const templateName = location?.state?.templateName ?? null;
  const isEditingTemplate = !!templateName;

  const [currentWorkout, setCurrentWorkout] = useState(
    location.state?.workoutData || { name: "", exercises: [] }
  );

  const [showSaveModal, setShowSaveModal] = useState(false);

  // -------------------------
  // Template Saving Logic
  // -------------------------
  const saveTemplate = (name) => {
    const templates = JSON.parse(localStorage.getItem("templates")) || {};
    templates[name] = currentWorkout;
    localStorage.setItem("templates", JSON.stringify(templates));
    setShowSaveModal(false);
    alert("Template saved.");
  };

  const updateTemplate = () => {
    const templates = JSON.parse(localStorage.getItem("templates")) || {};
    templates[templateName] = currentWorkout;
    localStorage.setItem("templates", JSON.stringify(templates));
    alert("Template updated.");
  };

  // -------------------------
  // Workout Actions
  // -------------------------
  const handleEndWorkout = () => {
    const confirmEnd = window.confirm("Are you proud of your effort?");
    if (!confirmEnd) return;

    // Save "last session" automatically
    localStorage.setItem("lastWorkout", JSON.stringify(currentWorkout));
    alert("Workout saved!");
    navigate("/lift");
  };

  const addSet = (exerciseIndex) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, idx) =>
        idx === exerciseIndex
          ? { ...ex, sets: [...ex.sets, { weight: "", reps: "", formNotes: "" }] }
          : ex
      ),
    }));
  };

  const updateSetField = (exerciseIndex, setIndex, field, value) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, idx) =>
        idx === exerciseIndex
          ? {
              ...ex,
              sets: ex.sets.map((set, sIdx) =>
                sIdx === setIndex ? { ...set, [field]: value } : set
              ),
            }
          : ex
      ),
    }));
  };

  const handleSelectExercise = (exercise) => {
    // Add exercise to workout
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { ...exercise, sets: [] } // start with empty sets
      ],
    }));

    // Ensure it exists in bank
    const bank = getExercises();
    if (!bank.find((ex) => ex.id === exercise.id)) {
      createExercise(exercise);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-4 text-black">
      {/* Top Nav */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate(-1)} className="text-blue-600 font-medium">
          Back
        </button>
        <button onClick={handleEndWorkout} className="px-4 py-2 bg-red-500 text-white rounded-lg">
          End Workout
        </button>
      </div>

      {/* Exercise Picker */}
      <ExercisePicker onSelect={handleSelectExercise} />

      {/* Workout Content */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-24 mt-4">
        {currentWorkout.exercises.map((ex, exIdx) => (
          <div key={ex.id || exIdx} className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-3">{ex.name}</h2>

            {ex.sets.map((set, setIdx) => (
              <div key={setIdx} className="p-3 bg-gray-100 rounded-lg mb-2">
                <div className="flex gap-3 mb-2">
                  <input
                    type="number"
                    className="w-1/2 p-2 border rounded-lg"
                    placeholder="Weight"
                    value={set.weight}
                    onChange={(e) => updateSetField(exIdx, setIdx, "weight", e.target.value)}
                  />
                  <input
                    type="number"
                    className="w-1/2 p-2 border rounded-lg"
                    placeholder="Reps"
                    value={set.reps}
                    onChange={(e) => updateSetField(exIdx, setIdx, "reps", e.target.value)}
                  />
                </div>
                <textarea
                  className="w-full p-2 border rounded-lg text-sm"
                  placeholder="Form Notes"
                  value={set.formNotes}
                  onChange={(e) => updateSetField(exIdx, setIdx, "formNotes", e.target.value)}
                />
              </div>
            ))}

            <button
              onClick={() => addSet(exIdx)}
              className="mt-3 w-full py-2 bg-blue-100 text-blue-700 rounded-lg"
            >
              Add Set
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Save Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-50 border-t flex flex-col gap-3">
        {isEditingTemplate && (
          <button onClick={updateTemplate} className="py-3 bg-green-600 text-white rounded-xl">
            Update Template
          </button>
        )}
        <button onClick={() => setShowSaveModal(true)} className="py-3 bg-gray-900 text-white rounded-xl">
          Save as New Template
        </button>
      </div>

      {/* Save Template Modal */}
      <SaveTemplateModal visible={showSaveModal} onClose={() => setShowSaveModal(false)} onSave={saveTemplate} />
    </div>
  );
}






