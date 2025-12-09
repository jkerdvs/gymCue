import React, { useEffect, useState } from "react";
import {
  getExercises,
  saveExercise,
  removeExercise,
  EQUIPMENT_TYPES,
  MUSCLE_GROUPS,
  DEFAULT_VARIATIONS,
} from "../lib/exerciseBank";

import FiltersBar from "../components/FiltersBar";
import ExerciseAccordion from "../components/ExerciseAccordion";
import AddExerciseModal from "../components/AddExerciseModal";
import ExerciseBankCard from "@/components/ExerciseBankCard";

export default function ExerciseBank() {
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("All");
  const [muscleFilter, setMuscleFilter] = useState("All");
  const [openModal, setOpenModal] = useState(false);
  const favorites = filtered.filter(ex => ex.favorite);


  useEffect(() => {
    const stored = getExercises();
    setList(stored);
    setFiltered(stored);
  }, []);

  // Filtering logic
  useEffect(() => {
    let data = [...list];

    if (equipmentFilter !== "All") {
      data = data.filter((ex) => ex.equipmentType === equipmentFilter);
    }
    if (muscleFilter !== "All") {
      data = data.filter((ex) => ex.muscleGroup === muscleFilter);
    }
    if (search.trim()) {
      data = data.filter((ex) =>
        ex.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(data);
  }, [search, equipmentFilter, muscleFilter, list]);

  const handleSaveExercise = (newEx) => {
    saveExercise(newEx);
    const updated = getExercises();
    setList(updated);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 text-black">
      <h1 className="text-xl font-bold">EXERCISE BANK</h1>

      {favorites.length > 0 && (
    <ExerciseAccordion
      muscle="★ Favorites"
     exercises={favorites}
      removeExercise={removeExercise}
      refresh={() => setList(getExercises())}
      />
    )}

      <FiltersBar
        search={search}
        setSearch={setSearch}
        equipmentFilter={equipmentFilter}
        setEquipmentFilter={setEquipmentFilter}
        muscleFilter={muscleFilter}
        setMuscleFilter={setMuscleFilter}
      />

      {/* Accordion by muscle group */}
      <div className="space-y-3">
        {MUSCLE_GROUPS.map((muscle) => {
          const groupItems = filtered.filter(
            (ex) => ex.muscleGroup === muscle
          );
          if (groupItems.length === 0) return null;

          return (
            <ExerciseAccordion
              key={muscle}
              muscle={muscle}
              exercises={groupItems}
              removeExercise={removeExercise}
              refresh={() => setList(getExercises())}
            />
          );
        })}
      </div>

      <button
        className="w-full py-3 rounded bg-blue-600 text-white font-semibold"
        onClick={() => setOpenModal(true)}
      >
        + Add Exercise
      </button>

      {openModal && (
        <AddExerciseModal
          close={() => setOpenModal(false)}
          save={handleSaveExercise}
        />
      )}
    </div>
  );
}
