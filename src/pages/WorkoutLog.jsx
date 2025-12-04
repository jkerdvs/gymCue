// src/pages/WorkoutLog.jsx
import React, { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import ExerciseCard from "../components/ExerciseCard";
import MiniChart from "../components/MiniChart";
import ExercisePicker from "../components/ExercisePicker";
import {
  getWorkouts,
  saveWorkout,
  getExerciseBest,
  getLatestWorkout,
} from "../lib/storage";
import {
  getExercises,
  ensureSeeded as ensureExerciseBankSeeded,
} from "../lib/exerciseBank";

/*
Notes:
- Templates are persisted in localStorage under "wc_templates".
- Templates store exercises array (with reps, weight, form) so loading them recreate the sets & forms.
- You can "Save Current Session as Template" or "Save Template as Workout (custom name)".
*/

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

const TEMPLATES_KEY = "wc_templates";

export default function WorkoutLog() {
  // session metadata
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  // exercises: array of { id, name, sets: [{reps, weight, form}], collapsed, muscleGroup }
  const [exercises, setExercises] = useState([]);

  // saved sessions (history)
  const [history, setHistory] = useState([]);

  // PR flash state: {exerciseId: true}
  const [prMap, setPrMap] = useState({});

  // add exercise input (legacy text mode still supported)
  const [newName, setNewName] = useState("");

  // templates
  const [templates, setTemplates] = useState([]);

  // exercise bank preview (for UI count)
  const [bankCount, setBankCount] = useState(0);

  // load history & templates & seed exercise bank on mount
  useEffect(() => {
    setHistory(getWorkouts());
    const raw = localStorage.getItem(TEMPLATES_KEY);
    try {
      setTemplates(raw ? JSON.parse(raw) : []);
    } catch {
      setTemplates([]);
    }

    // ensure exercise bank seeded and get count
    try {
      ensureExerciseBankSeeded();
      const b = getExercises();
      setBankCount(b.length);
    } catch (err) {
      console.error("exercise bank seed error", err);
    }
  }, []);

  // timer effects
  useEffect(() => {
    if (started) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [started]);

  // helper to update a single exercise by id
  const updateExercise = (nextEx) => {
    setExercises((prev) => prev.map((e) => (e.id === nextEx.id ? nextEx : e)));
  };

  const removeExercise = (id) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  };

  const addExercise = (prefillSets = []) => {
    if (!newName || newName.trim() === "") return;
    const ex = {
      id: uuidv4(),
      name: newName.trim(),
      sets:
        prefillSets.length > 0
          ? prefillSets.map((s) => ({ reps: s.reps ?? "", weight: s.weight ?? "", form: s.form ?? 5 }))
          : [],
      collapsed: false,
      muscleGroup: null,
    };
    setExercises((p) => [...p, ex]);
    setNewName("");
  };

  // when adding by name, suggest last session's sets for that exercise
  const addExerciseWithSuggestion = () => {
    const name = newName.trim();
    if (!name) return;

    const latest = getLatestWorkout();
    // find last occurrence in latest workout
    let suggested = [];
    if (latest && latest.exercises) {
      const match = latest.exercises.find((e) => (e.name || "").toLowerCase() === name.toLowerCase());
      if (match && match.sets) {
        // use last sets as suggestions (copy) and ensure form exists
        suggested = match.sets.map((s) => ({ reps: s.reps || "", weight: s.weight || "", form: s.form ?? 5 }));
      }
    }
    addExercise(suggested);
  };

  // NEW: add from bank. bankEx contains name, variation, muscleGroup, etc.
  const addFromBank = (bankEx) => {
    if (!bankEx) return;
    // attempt to find last sets by matching name in history (latest first)
    const all = getWorkouts().slice().reverse();
    let suggested = [];
    for (let w of all) {
      const found = (w.exercises || []).find((e) => (e.name || "").toLowerCase() === (bankEx.name || "").toLowerCase());
      if (found && found.sets && found.sets.length) {
        suggested = found.sets.map((s) => ({ reps: s.reps ?? "", weight: s.weight ?? "", form: s.form ?? 5 }));
        break;
      }
    }
    const ex = {
      id: uuidv4(),
      name: bankEx.name,
      sets: suggested,
      collapsed: false,
      muscleGroup: bankEx.muscleGroup || null,
      equipmentType: bankEx.equipmentType || null,
      variation: bankEx.variation || null,
      sourceExerciseId: bankEx.id || null,
    };
    setExercises((p) => [...p, ex]);
  };

  // Save the whole session; optional customName to store friendly name
  const finishAndSave = (customName) => {
    if (exercises.length === 0) return alert("Add at least one exercise.");

    const savedAt = new Date().toISOString();
    const workout = {
      id: Date.now(),
      name: customName || `Workout ${new Date().toLocaleDateString()}`,
      date: new Date().toLocaleDateString(),
      savedAt,
      durationSeconds: seconds,
      exercises,
    };

    // detect PRs (for each exercise check best before saving)
    const prDetected = {};
    exercises.forEach((ex) => {
      const currentMax = Math.max(
        ...(ex.sets && ex.sets.length ? ex.sets.map((s) => Number(s.weight) || 0) : [0])
      );
      const prevBest = getExerciseBest(ex.name);
      if (currentMax > prevBest && currentMax > 0) {
        prDetected[ex.id] = true;
      }
    });

    // save (uses your existing saveWorkout helper)
    saveWorkout(workout);

    // update local history state
    const newHist = getWorkouts();
    setHistory(newHist);

    // flash PR UI
    if (Object.keys(prDetected).length > 0) {
      setPrMap(prDetected);
      // remove PR highlight after 3s
      setTimeout(() => setPrMap({}), 3000);
    }

    // reset session
    setExercises([]);
    setSeconds(0);
    setStarted(false);
    alert("Workout saved! ✅");
  };

  // Quick "load last session" - populates current session with latest workout exercises (for quick repeat)
  const loadLastSession = () => {
    const latest = getLatestWorkout();
    if (!latest) return alert("No previous session found.");
    // clone latest exercises into a new session with new ids
    const cloned = (latest.exercises || []).map((e) => ({
      id: uuidv4(),
      name: e.name,
      sets: (e.sets || []).map((s) => ({ reps: s.reps ?? "", weight: s.weight ?? "", form: s.form ?? 5 })),
      collapsed: false,
      muscleGroup: e.muscleGroup || null,
    }));
    setExercises(cloned);
    setStarted(true);
    setSeconds(0);
  };

  // Templates: helpers
  const persistTemplates = (next) => {
    try {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(next));
    } catch (err) {
      console.error("Failed to save templates", err);
    }
    setTemplates(next);
  };

  const saveCurrentAsTemplate = () => {
    if (exercises.length === 0) return alert("Add some exercises first to save as a template.");
    const name = prompt("Template name?");
    if (!name || !name.trim()) return;
    const tpl = {
      id: uuidv4(),
      name: name.trim(),
      exercises: exercises.map((e) => ({
        name: e.name,
        sets: (e.sets || []).map((s) => ({ reps: s.reps ?? "", weight: s.weight ?? "", form: s.form ?? 5 })),
      })),
      createdAt: new Date().toISOString(),
    };
    persistTemplates([tpl, ...templates]);
    alert("Template saved!");
  };

  const deleteTemplate = (id) => {
    if (!confirm("Delete this template?")) return;
    persistTemplates(templates.filter((t) => t.id !== id));
  };

  // Load template into current session (clones exercises & gives new ids)
  const loadTemplateIntoSession = (tplId) => {
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return;
    const cloned = (tpl.exercises || []).map((e) => ({
      id: uuidv4(),
      name: e.name,
      sets: (e.sets || []).map((s) => ({ reps: s.reps ?? "", weight: s.weight ?? "", form: s.form ?? 5 })),
      collapsed: false,
    }));
    setExercises(cloned);
    setStarted(true);
    setSeconds(0);
  };

  // Save a workout directly from a template (prompt for custom name)
  const saveTemplateAsWorkout = (tplId) => {
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return alert("Template not found.");
    const name = prompt("Workout name for this session?");
    const workoutName = name && name.trim() ? name.trim() : `${tpl.name} — ${new Date().toLocaleDateString()}`;

    const workout = {
      id: Date.now(),
      name: workoutName,
      date: new Date().toLocaleDateString(),
      savedAt: new Date().toISOString(),
      durationSeconds: 0,
      exercises: (tpl.exercises || []).map((e) => ({
        id: uuidv4(),
        name: e.name,
        sets: (e.sets || []).map((s) => ({ reps: s.reps ?? "", weight: s.weight ?? "", form: s.form ?? 5 })),
      })),
    };

    saveWorkout(workout);
    setHistory(getWorkouts());
    alert("Workout saved from template! ✅");
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-3xl mx-auto px-4 py-5 space-y-6">

        {/* Header & Timer (mobile-first stacked; desktop: row) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-semibold">Workout Session</h1>
            <div className="text-xs text-gray-500 mt-1">Create a session with multiple exercises & sets</div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="text-xs text-gray-500">Duration</div>
            <div className="font-mono text-lg">{formatTime(seconds)}</div>

            <div className="mt-1 flex w-full sm:w-auto gap-2">
              <button
                onClick={() => setStarted((s) => !s)}
                className={`flex-1 sm:flex-none rounded px-3 py-2 text-sm font-medium ${
                  started ? "bg-red-600 text-white" : "bg-green-600 text-white"
                }`}
              >
                {started ? "Pause" : "Start"}
              </button>

              <button
                onClick={() => {
                  setStarted(false);
                  setSeconds(0);
                }}
                className="flex-1 sm:flex-none rounded px-3 py-2 text-sm border"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Add exercise + templates */}
        <div className="bg-gray-50 p-3 rounded-lg shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* ExercisePicker replaces manual typing */}
            <div className="flex-1">
              <ExercisePicker
                onSelect={(ex) => addFromBank(ex)}
                allowCreate={true}
                placeholder={`Pick an exercise (bank: ${bankCount}) or create new`}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  // legacy: add blank entry using typed name (if any)
                  addExercise([]);
                }}
                className="px-3 py-2 rounded bg-gray-200 border text-sm"
              >
                + Blank
              </button>

              <button
                onClick={saveCurrentAsTemplate}
                className="px-3 py-2 rounded bg-purple-600 text-white text-sm"
              >
                Save as Template
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div>Tip: pick from the bank to auto-fill last session data.</div>
            <div>
              <a href="/exercise-bank" className="underline">
                Manage Bank
              </a>
            </div>
          </div>
        </div>

        {/* Compact templates list */}
        {templates.length > 0 && (
          <div id="templates-list" className="bg-white p-3 rounded-lg shadow-sm text-black">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm">Saved Templates</div>
              <div className="text-xs text-gray-500">{templates.length} total</div>
            </div>

            <div className="mt-2 space-y-2">
              {templates.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border rounded px-2 py-2"
                >
                  <div>
                    <div className="font-medium text-sm truncate">{t.name}</div>
                    <div className="text-xs text-gray-500">{(t.exercises || []).length} exercises</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => loadTemplateIntoSession(t.id)}
                      className="px-2 py-1 rounded border text-sm bg-gray-50"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => saveTemplateAsWorkout(t.id)}
                      className="px-2 py-1 rounded border text-sm bg-green-50"
                    >
                      Save as Workout
                    </button>
                    <button
                      onClick={() => deleteTemplate(t.id)}
                      className="px-2 py-1 rounded border text-sm text-red-600 bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercises list - responsive layout */}
        <div className="space-y-4">
          {exercises.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-6">No exercises in current session.</div>
          )}

          {exercises.map((ex) => (
            <div
              key={ex.id}
              className={`border rounded-lg p-3 bg-white shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3 items-start ${
                prMap[ex.id] ? "ring-2 ring-yellow-300" : ""
              }`}
            >
              {/* Main exercise card (takes 2 cols on md+) */}
              <div className="md:col-span-2">
                <ExerciseCard
                  exercise={ex}
                  onUpdate={(next) => updateExercise(next)}
                  onRemove={removeExercise}
                  suggestedSets={[]}
                  isPR={!!prMap[ex.id]}
                />
              </div>

              {/* Small history / chart column (on mobile it moves below because grid is single-column) */}
              <div className="md:col-span-1">
                <div className="bg-gray-50 rounded p-2 text-sm">
                  <div className="text-xs text-gray-500">History</div>
                  <div className="mt-2">
                    <MiniChart data={[]} />
                  </div>
                  <div className="mt-2 text-xs text-gray-700">
                    Max previously: <strong>{getExerciseBest(ex.name) || 0} lbs</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions (desktop/tablet) */}
        <div className="hidden sm:flex gap-3 justify-start">
          <button
            onClick={() => finishAndSave()}
            className="bg-green-600 text-white px-4 py-2 rounded shadow text-sm"
          >
            Finish & Save Session
          </button>

          <button
            onClick={loadLastSession}
            className="bg-gray-100 px-4 py-2 rounded border text-sm"
          >
            Load Last Session
          </button>

          <button
            onClick={() => {
              if (!confirm("Clear current unsaved session?")) return;
              setExercises([]);
              setSeconds(0);
              setStarted(false);
            }}
            className="bg-red-50 px-3 py-2 rounded text-red-600 border text-sm"
          >
            Clear Session
          </button>
        </div>

        {/* Mini history preview */}
        <div className="space-y-2">
          <h3 className="text-base font-medium">Recent Sessions</h3>
          <div className="space-y-2">
            {history.length === 0 && <div className="text-sm text-gray-500">No sessions yet.</div>}
            {history.slice(-5).reverse().map((w) => (
              <div
                key={w.id}
                className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center text-black"
              >
                <div>
                  <div className="font-medium text-sm">{w.name || `Workout — ${w.date}`}</div>
                  <div className="text-xs text-gray-500">
                    {w.exercises.length} exercises • {Math.round((w.durationSeconds || 0) / 60)} min
                  </div>
                </div>
                <div className="text-xs text-gray-500">Saved</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky bottom actions for mobile (one-thumb access) */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t sm:hidden">
        <div className="max-w-3xl mx-auto flex gap-2">
          <button
            onClick={() => finishAndSave()}
            className="flex-1 py-3 bg-green-600 text-white rounded text-sm font-medium"
            aria-label="Finish and save"
          >
            Save Workout
          </button>

          <button
            onClick={loadLastSession}
            className="w-20 py-3 bg-gray-100 rounded border text-sm"
            aria-label="Load last"
            title="Load last session"
          >
            Load
          </button>

          <button
            onClick={() => {
              if (!confirm("Clear current unsaved session?")) return;
              setExercises([]);
              setSeconds(0);
              setStarted(false);
            }}
            className="w-20 py-3 bg-red-50 rounded border text-red-600 text-sm"
            aria-label="Clear session"
            title="Clear"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}


