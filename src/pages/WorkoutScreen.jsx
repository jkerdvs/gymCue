import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SaveTemplateModal from "../components/SaveTemplateModal";

export default function WorkoutScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  // Detect template editing or new workout
  const templateName = location?.state?.templateName ?? null;
  const isEditingTemplate = !!templateName;

  // Load workout if passed, otherwise start fresh
  const [currentWorkout, setCurrentWorkout] = useState(
    location.state?.workoutData || {
      exercises: [],
    }
  );

  // Modal control
  const [showSaveModal, setShowSaveModal] = useState(false);

  // -------------------------
  // Template Saving Logic
  // -------------------------

  const handleUpdateTemplate = () => {
    const templates = JSON.parse(localStorage.getItem("templates")) || {};
    templates[templateName] = currentWorkout;
    localStorage.setItem("templates", JSON.stringify(templates));
    alert("Template updated.");
  };

  const handleSaveNewTemplate = (newName) => {
    const templates = JSON.parse(localStorage.getItem("templates")) || {};
    templates[newName] = currentWorkout;
    localStorage.setItem("templates", JSON.stringify(templates));
    setShowSaveModal(false);
    alert("Template saved.");
    navigate("/template-menu");
  };

  // -------------------------
  // Workout Actions
  // -------------------------

  const handleEndWorkout = () => {
    const confirmEnd = window.confirm("Are you proud of your effort?");
    if (!confirmEnd) {
      alert("Do another set.");
      return;
    }
    navigate("/lift");
  };

  const addExercise = () => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { name: "New Exercise", sets: [] }
      ]
    }));
  };

  const addSet = (exerciseIndex) => {
    const updated = { ...currentWorkout };
    updated.exercises[exerciseIndex].sets.push({
      reps: "",
      weight: "",
      formNotes: "",
    });
    setCurrentWorkout(updated);
  };

  const updateSetField = (exerciseIndex, setIndex, field, value) => {
    const updated = { ...currentWorkout };
    updated.exercises[exerciseIndex].sets[setIndex][field] = value;
    setCurrentWorkout(updated);
  };

  // -------------------------
  // Layout
  // -------------------------

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-4">

      {/* Top Nav */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate(-1)} className="text-blue-600 font-medium">
          Back
        </button>

        <button
          onClick={handleEndWorkout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          End Workout
        </button>
      </div>

      {/* Workout Content */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-24">

        {currentWorkout.exercises.map((ex, exerciseIndex) => (
          <div
            key={exerciseIndex}
            className="bg-white p-4 rounded-xl shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-3">{ex.name}</h2>

            <div className="space-y-4">
              {ex.sets.map((set, setIndex) => (
                <div
                  key={setIndex}
                  className="p-3 bg-gray-100 rounded-lg"
                >
                  {/* Weight & Reps */}
                  <div className="flex gap-3 mb-2">
                    <input
                      type="number"
                      className="w-1/2 p-2 border rounded-lg"
                      placeholder="Weight"
                      value={set.weight}
                      onChange={(e) =>
                        updateSetField(exerciseIndex, setIndex, "weight", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className="w-1/2 p-2 border rounded-lg"
                      placeholder="Reps"
                      value={set.reps}
                      onChange={(e) =>
                        updateSetField(exerciseIndex, setIndex, "reps", e.target.value)
                      }
                    />
                  </div>

                  {/* FORM TRACKER — your identity */}
                  <textarea
                    className="w-full p-2 border rounded-lg text-sm"
                    placeholder="Form Notes (What did you focus on?)"
                    value={set.formNotes}
                    onChange={(e) =>
                      updateSetField(exerciseIndex, setIndex, "formNotes", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => addSet(exerciseIndex)}
              className="mt-3 w-full py-2 bg-blue-100 text-blue-700 rounded-lg"
            >
              Add Set
            </button>
          </div>
        ))}

        {/* Add Exercise */}
        <button
          onClick={addExercise}
          className="w-full py-3 bg-blue-600 text-white rounded-xl mt-4"
        >
          Add Exercise
        </button>
      </div>

      {/* Bottom Save Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-50 border-t flex flex-col gap-3">

        {isEditingTemplate && (
          <button
            onClick={handleUpdateTemplate}
            className="py-3 bg-green-600 text-white rounded-xl"
          >
            Update Template
          </button>
        )}

        <button
          onClick={() => setShowSaveModal(true)}
          className="py-3 bg-gray-900 text-white rounded-xl"
        >
          Save as New Template
        </button>
      </div>

      {/* Save Bottom Sheet */}
      <SaveTemplateModal
        visible={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveNewTemplate}
      />
    </div>
  );
}

