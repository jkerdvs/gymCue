// src/lib/storage.js
const STORAGE_KEY = "workouts";

export function getWorkouts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to parse workouts from storage", e);
    return [];
  }
}

export function saveWorkout(workout) {
  const list = getWorkouts();
  list.push(workout);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return workout;
}

export function clearWorkouts() {
  localStorage.removeItem(STORAGE_KEY);
}

// return latest workout (most recent by id/date)
export function getLatestWorkout() {
  const list = getWorkouts();
  if (list.length === 0) return null;
  return list[list.length - 1];
}

// return an array of all sets (weights) logged for a given exercise name across history
export function getExerciseHistory(exerciseName) {
  const list = getWorkouts();
  const history = [];
  list.forEach((w) => {
    if (Array.isArray(w.exercises)) {
      w.exercises.forEach((ex) => {
        if ((ex.name || "").toLowerCase() === (exerciseName || "").toLowerCase()) {
          // collect the max weight per exercise entry or each set weight (we'll collect each set)
          if (Array.isArray(ex.sets)) {
            ex.sets.forEach((s) => {
              const parsed = Number(s.weight) || 0;
              const date = w.date || w.savedAt || new Date(w.id).toLocaleDateString();
              history.push({ weight: parsed, date });
            });
          }
        }
      });
    }
  });

  // sort by date (can't be perfect if date strings are locale, but works well enough)
  return history;
}

// return best (max) weight for an exercise; 0 if none
export function getExerciseBest(exerciseName) {
  const hist = getExerciseHistory(exerciseName);
  if (hist.length === 0) return 0;
  return Math.max(...hist.map((h) => Number(h.weight) || 0));
}
