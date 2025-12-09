import React from "react";

export default function ExerciseBankCard({ exercise, onRemove }) {
  return (
    <div className="bg-gray-50 p-3 rounded border flex justify-between items-center">
      <div>
        <div className="font-medium text-black">
          {exercise.name}
        </div>
        <div className="text-xs text-gray-600">
          {exercise.equipmentType} • {exercise.variation} • {exercise.muscleGroup}
          {exercise.userCreated ? " • custom" : ""}
        </div>
      </div>

      <button
        className="text-red-600 border px-2 py-1 text-xs rounded bg-red-50"
        onClick={() => onRemove(exercise.id)}
      >
        Delete
      </button>
    </div>
  );
}
