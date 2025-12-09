import React, { useState, useRef } from "react";
import { MUSCLE_GROUPS, EQUIPMENT_TYPES } from "../lib/exerciseBank";

export default function EditExerciseModal({ exercise, close, update }) {
  const [name, setName] = useState(exercise.name);
  const [equipmentType, setEquipmentType] = useState(exercise.equipmentType);
  const [muscleGroup, setMuscleGroup] = useState(exercise.muscleGroup);

  const overlayRef = useRef(null);

  const handleSave = () => {
    update({
      ...exercise,
      name,
      equipmentType,
      muscleGroup,
    });
    close();
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) close();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
    >
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg animate-scaleIn space-y-4 text-black">
        <h2 className="text-xl font-bold text-center">Edit Exercise</h2>

        {/* NAME */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Name</label>
          <input
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Exercise Name"
          />
        </div>

        {/* EQUIPMENT */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Equipment</label>
          <select
            className="w-full border px-3 py-2 rounded bg-white"
            value={equipmentType}
            onChange={(e) => setEquipmentType(e.target.value)}
          >
            {EQUIPMENT_TYPES.map((eq) => (
              <option key={eq} value={eq}>
                {eq}
              </option>
            ))}
          </select>
        </div>

        {/* MUSCLE GROUP */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Muscle Group</label>
          <select
            className="w-full border px-3 py-2 rounded bg-white"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
          >
            {MUSCLE_GROUPS.map((mg) => (
              <option key={mg} value={mg}>
                {mg}
              </option>
            ))}
          </select>
        </div>

        {/* ACTION BUTTONS */}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          onClick={handleSave}
        >
          Save Changes
        </button>

        <button
          className="w-full py-2 rounded border border-gray-300 font-medium hover:bg-gray-100 transition"
          onClick={close}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

