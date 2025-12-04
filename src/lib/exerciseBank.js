// src/lib/exerciseBank.js
// Storage helpers for the Exercise Bank (localStorage-backed)

const KEY = "wc_exercises_v1";

/**
 * Default exercises list shipped with the app.
 * Each exercise: { id, name, equipmentType, variation, muscleGroup, userCreated }
 */
const DEFAULT_EXERCISES = [
  // Biceps
  {
    id: "ex-dumbbell-biceps-curl-standing-hammer",
    name: "Biceps Curl",
    equipmentType: "Dumbbell",
    variation: "Standing",
    muscleGroup: "Biceps",
    userCreated: false,
  },
  {
    id: "ex-barbell-biceps-curl-standing",
    name: "Biceps Curl",
    equipmentType: "Barbell",
    variation: "Standing",
    muscleGroup: "Biceps",
    userCreated: false,
  },
  {
    id: "ex-dumbbell-biceps-curl-seated-hammer",
    name: "Biceps Curl",
    equipmentType: "Dumbbell",
    variation: "Seated - Hammer",
    muscleGroup: "Biceps",
    userCreated: false,
  },

  // Chest
  {
    id: "ex-barbell-bench-press-flat",
    name: "Bench Press",
    equipmentType: "Barbell",
    variation: "Flat",
    muscleGroup: "Chest",
    userCreated: false,
  },
  {
    id: "ex-dumbbell-bench-press-incline",
    name: "Bench Press",
    equipmentType: "Dumbbell",
    variation: "Incline",
    muscleGroup: "Chest",
    userCreated: false,
  },

  // Back
  {
    id: "ex-barbell-deadlift-conventional",
    name: "Deadlift",
    equipmentType: "Barbell",
    variation: "Conventional",
    muscleGroup: "Back",
    userCreated: false,
  },
  {
    id: "ex-barbell-row-bent-over",
    name: "Bent Over Row",
    equipmentType: "Barbell",
    variation: "Bent Over",
    muscleGroup: "Back",
    userCreated: false,
  },

  // Legs
  {
    id: "ex-barbell-squat-back",
    name: "Back Squat",
    equipmentType: "Barbell",
    variation: "Back",
    muscleGroup: "Legs",
    userCreated: false,
  },
  {
    id: "ex-leg-press-machine",
    name: "Leg Press",
    equipmentType: "Machine",
    variation: "Standard",
    muscleGroup: "Legs",
    userCreated: false,
  },

  // Shoulders
  {
    id: "ex-dumbbell-shoulder-press-standing",
    name: "Shoulder Press",
    equipmentType: "Dumbbell",
    variation: "Standing",
    muscleGroup: "Shoulders",
    userCreated: false,
  },
];

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      // seed defaults
      localStorage.setItem(KEY, JSON.stringify(DEFAULT_EXERCISES));
      return DEFAULT_EXERCISES.slice();
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("exerciseBank read error", err);
    localStorage.setItem(KEY, JSON.stringify(DEFAULT_EXERCISES));
    return DEFAULT_EXERCISES.slice();
  }
}

function write(next) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch (err) {
    console.error("exerciseBank write error", err);
  }
}

/** Public API **/

export function getExercises() {
  return read();
}

export function getExerciseById(id) {
  const all = read();
  return all.find((e) => e.id === id) || null;
}

export function saveExercise(ex) {
  const all = read();
  const existingIdx = all.findIndex((x) => x.id === ex.id);
  if (existingIdx >= 0) {
    all[existingIdx] = { ...all[existingIdx], ...ex };
  } else {
    all.unshift(ex);
  }
  write(all);
  return ex;
}

export function removeExercise(id) {
  const all = read().filter((e) => e.id !== id);
  write(all);
  return all;
}

/**
 * Find by fuzzy name/equipment/variation. Good for searching.
 * query: string
 */
export function searchExercises(query) {
  if (!query) return read();
  const q = query.toLowerCase();
  return read().filter((e) => {
    return (
      (e.name || "").toLowerCase().includes(q) ||
      (e.equipmentType || "").toLowerCase().includes(q) ||
      (e.variation || "").toLowerCase().includes(q) ||
      (e.muscleGroup || "").toLowerCase().includes(q)
    );
  });
}

/** Utility: ensure defaults exist (used at app start) */
export function ensureSeeded() {
  // calling read() will seed defaults if absent
  read();
}

/** Helpful lists */
export const EQUIPMENT_TYPES = [
  "Dumbbell",
  "Barbell",
  "Cable",
  "Machine",
  "Bodyweight",
  "Kettlebell",
  "Other",
];

export const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Legs",
  "Glutes",
  "Core",
  "Full Body",
  "Other",
];

export const DEFAULT_VARIATIONS = {
  Dumbbell: ["Standing", "Seated", "Incline", "Hammer", "Reverse", "Neutral"],
  Barbell: ["Standing", "Back", "Front", "Incline"],
  Cable: ["Standard", "Single Arm", "Cross"],
  Machine: ["Standard"],
  Bodyweight: ["Standard", "Assisted"],
  Kettlebell: ["Standard"],
  Other: ["Standard"],
};
