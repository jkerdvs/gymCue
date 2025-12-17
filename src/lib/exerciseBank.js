// src/lib/exerciseBank.js
const STORAGE_KEY = "exerciseBank";

/* ---------- Exercise Meta ---------- */
export const EQUIPMENT_TYPES = [
  "Dumbbell",
  "Barbell",
  "Machine",
  "Bodyweight",
  "Cable",
  "Kettlebell",
];

export const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Legs",
  "Core",
  "Full Body",
];

export const DEFAULT_VARIATIONS = {
  Dumbbell: ["Standard", "Incline", "Decline"],
  Barbell: ["Standard", "Incline", "Decline"],
  Machine: ["Standard"],
  Bodyweight: ["Standard"],
  Cable: ["Standard"],
  Kettlebell: ["Standard"],
};

/* ---------- Helpers ---------- */
function loadBank() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveBank(bank) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
}

/* ---------- Public API ---------- */
export function getExercises() {
  return loadBank();
}

export function getExerciseById(id) {
  return loadBank().find((ex) => ex.id === id);
}

export function createExercise({ name, equipmentType = "Dumbbell", variation = "Standard", muscleGroup = "Chest" }) {
  const bank = loadBank();

  const newExercise = {
    id: crypto.randomUUID(),
    name: name.trim(),
    equipmentType,
    variation,
    muscleGroup,
    createdAt: Date.now(),
  };

  bank.push(newExercise);
  saveBank(bank);

  return newExercise;
}

export function updateExercise(id, updates) {
  const bank = loadBank();
  const index = bank.findIndex((ex) => ex.id === id);
  if (index === -1) return null;

  bank[index] = { ...bank[index], ...updates };
  saveBank(bank);

  return bank[index];
}

export function removeExercise(id) {
  const bank = loadBank();
  const updated = bank.filter((ex) => ex.id !== id);
  saveBank(updated);
  return updated;
}

export function searchExercises(query) {
  const lower = query.toLowerCase();
  return loadBank().filter(
    (ex) =>
      ex.name.toLowerCase().includes(lower) ||
      ex.muscleGroup.toLowerCase().includes(lower) ||
      ex.equipmentType.toLowerCase().includes(lower)
  );
}


