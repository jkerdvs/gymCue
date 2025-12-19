import { v4 as uuidv4 } from "uuid";
import { getFromStorage, saveToStorage } from "./storage";

const EX_KEY = "exerciseBank";

export function getExercises() {
  return getFromStorage(EX_KEY, []);
}

export function createExercise(ex) {
  const exercises = getExercises();
  const newEx = { id: uuidv4(), ...ex };
  exercises.push(newEx);
  saveToStorage(EX_KEY, exercises);
  return newEx;
}

export function updateExercise(updatedEx) {
  const exercises = getExercises();
  const idx = exercises.findIndex(e => e.id === updatedEx.id);
  if (idx === -1) return null;
  exercises[idx] = updatedEx;
  saveToStorage(EX_KEY, exercises);
  return updatedEx;
}

// Delete an exercise by id
export function deleteExercise(id) {
  const exercises = getExercises();
  const filtered = exercises.filter((ex) => ex.id !== id);
  saveToStorage(EX_KEY, filtered);
  return filtered;
}