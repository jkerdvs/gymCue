// src/pages/WorkoutLog.jsx
import React, { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import ExerciseCard from "../components/ExerciseCard";
import MiniChart from "../components/MiniChart";
import {
  getWorkouts,
  saveWorkout,
  getExerciseBest,
  getLatestWorkout,
} from "../lib/storage";

/*
Notes:
- Templates are persisted in localStorage under "wc_templates".
- Templates store exercises array (with reps, weight, form) so loading them recreates the sets & forms.
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

  // exercises: array of { id, name, sets: [{reps, weight, form}], collapsed }
  const [exercises, setExercises] = useState([]);

  // saved sessions (history)
  const [history, setHistory] = useState([]);

  // PR flash state: {exerciseId: true}
  const [prMap, setPrMap] = useState({});

  // add exercise input
  const [newName, setNewName] = useState("");

  // templates
  const [templates, setTemplates] = useState([]);

  // load history & templates on mount
  useEffect(() => {
    setHistory(getWorkouts());
    const raw = localStorage.getItem(TEMPLATES_KEY);
    try {
      setTemplates(raw ? JSON.parse(raw) : []);
    } catch {
      setTemplates([]);
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
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-black">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Workout Session</h1>
          <div className="text-sm text-gray-500">Create a session with multiple exercises & sets</div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">Duration</div>
          <div className="text-xl font-mono">{formatTime(seconds)}</div>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setStarted((s) => !s)}
              className={`px-3 py-1 rounded ${started ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
            >
              {started ? "Pause" : "Start"}
            </button>
            <button
              onClick={() => {
                setStarted(false);
                setSeconds(0);
              }}
              className="px-3 py-1 border rounded"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Add exercise input + template controls */}
      <div className="bg-gray-50 p-4 rounded shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex gap-3 flex-1">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Exercise name (e.g. Bench Press)"
            className="flex-1 border p-2 rounded bg-white text-black placeholder-gray-400"
          />
          <button onClick={addExerciseWithSuggestion} className="px-4 rounded bg-blue-600 text-white">
            + Add (suggest last)
          </button>
          <button
            onClick={() => addExercise([])}
            className="px-4 rounded bg-gray-200 text-black border"
          >
            + Add blank
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <select
            onChange={(e) => {
              if (!e.target.value) return;
              loadTemplateIntoSession(e.target.value);
              e.target.selectedIndex = 0; // reset select
            }}
            className="border p-2 rounded bg-white text-black"
            aria-label="Load template"
          >
            <option value="">Load Template...</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <button
            onClick={saveCurrentAsTemplate}
            className="px-3 py-2 rounded bg-purple-600 text-white"
          >
            Save as Template
          </button>
        </div>
      </div>

      {/* Templates list (compact) */}
      {templates.length > 0 && (
        <div className="bg-white p-3 rounded shadow-sm text-black">
          <div className="flex items-center justify-between">
            <div className="font-medium">Saved Templates</div>
            <div className="text-xs text-gray-500">{templates.length} total</div>
          </div>
          <div className="mt-2 space-y-2">
            {templates.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-2 border p-2 rounded"
              >
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-gray-500">{(t.exercises || []).length} exercises</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadTemplateIntoSession(t.id)}
                    className="px-2 py-1 border rounded bg-gray-100"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => saveTemplateAsWorkout(t.id)}
                    className="px-2 py-1 border rounded bg-green-100"
                  >
                    Save as Workout
                  </button>
                  <button
                    onClick={() => deleteTemplate(t.id)}
                    className="px-2 py-1 border rounded text-red-600 bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercises list */}
      <div className="space-y-3">
        {exercises.length === 0 && <div className="text-sm text-gray-500">No exercises in current session.</div>}

        {exercises.map((ex) => (
          <div key={ex.id} className="grid grid-cols-3 gap-4 items-start">
            <div className="col-span-2">
              <ExerciseCard
                exercise={ex}
                onUpdate={(next) => updateExercise(next)}
                onRemove={removeExercise}
                suggestedSets={[]}
                isPR={!!prMap[ex.id]}
              />
            </div>
            <div className="col-span-1">
              <div className="bg-white p-2 rounded shadow-sm text-black">
                <div className="text-xs text-gray-500">History</div>
                <MiniChart data={[]} />
                <div className="text-sm mt-2 text-gray-700">
                  Max previously: <strong>{getExerciseBest(ex.name) || 0} lbs</strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={() => finishAndSave()} className="bg-green-600 text-white px-4 py-2 rounded shadow">
          Finish & Save Session
        </button>

        <button onClick={loadLastSession} className="bg-gray-100 px-4 py-2 rounded border text-black">
          Load Last Session
        </button>

        <button
          onClick={() => {
            if (!confirm("Clear current unsaved session?")) return;
            setExercises([]);
            setSeconds(0);
            setStarted(false);
          }}
          className="bg-red-50 px-3 py-2 rounded text-red-600 border"
        >
          Clear Session
        </button>
      </div>

      {/* Mini history preview */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Sessions</h3>
        <div className="space-y-2">
          {history.length === 0 && <div className="text-sm text-gray-500">No sessions yet.</div>}
          {history.slice(-5).reverse().map((w) => (
            <div
              key={w.id}
              className="bg-white p-3 rounded shadow-sm flex justify-between items-center text-black"
            >
              <div>
                <div className="font-medium">{w.name || `Workout — ${w.date}`}</div>
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
  );
}
