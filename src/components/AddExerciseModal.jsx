import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  EQUIPMENT_TYPES,
  MUSCLE_GROUPS,
  DEFAULT_VARIATIONS,
} from "../lib/exerciseBank";

export default function AddExerciseModal({ close, save }) {
  const [form, setForm] = useState({
    name: "",
    equipmentType: "Dumbbell",
    variation: "",
    muscleGroup: "Chest",
  });

  const variationOptions =
    DEFAULT_VARIATIONS[form.equipmentType] || ["Standard"];

  const handleSubmit = () => {
    if (!form.name.trim()) return alert("Name required");

    save({
      id: uuidv4(),
      name: form.name.trim(),
      equipmentType: form.equipmentType,
      variation: form.variation || variationOptions[0],
      muscleGroup: form.muscleGroup,
      userCreated: true,
    });

    close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-80 space-y-3">
        <h2 className="text-lg font-semibold">Add Exercise</h2>

        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border px-2 py-2 rounded w-full"
          placeholder="Exercise name"
        />

        <select
          value={form.equipmentType}
          onChange={(e) =>
            setForm({ ...form, equipmentType: e.target.value, variation: "" })
          }
          className="border px-2 py-2 rounded w-full"
        >
          {EQUIPMENT_TYPES.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>

        <select
          value={form.variation}
          onChange={(e) => setForm({ ...form, variation: e.target.value })}
          className="border px-2 py-2 rounded w-full"
        >
          <option value="">Select variation</option>
          {variationOptions.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>

        <select
          value={form.muscleGroup}
          onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })}
          className="border px-2 py-2 rounded w-full"
        >
          {MUSCLE_GROUPS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <div className="flex gap-2 pt-2">
          <button
            className="flex-1 bg-blue-600 text-white py-2 rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
          <button className="flex-1 border py-2 rounded" onClick={close}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
