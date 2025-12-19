import { v4 as uuidv4 } from "uuid";
import { getFromStorage, saveToStorage } from "./storage";

const W_KEY = "workouts";

export function getWorkouts() {
  return getFromStorage(W_KEY, []);
}

export function saveWorkout(workout) {
  const workouts = getWorkouts();
  const newWorkout = { id: uuidv4(), date: new Date().toISOString(), ...workout };
  workouts.push(newWorkout);
  saveToStorage(W_KEY, workouts);
  return newWorkout;
}

export function updateWorkout(workout) {
  const workouts = getWorkouts();
  const idx = workouts.findIndex(w => w.id === workout.id);
  if (idx === -1) return saveWorkout(workout);
  workouts[idx] = workout;
  saveToStorage(W_KEY, workouts);
  return workouts[idx];
}

export function getLatestWorkout() {
  const workouts = getWorkouts();
  return workouts.length ? workouts[workouts.length-1] : null;
}
