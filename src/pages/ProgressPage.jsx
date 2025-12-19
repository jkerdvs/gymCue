// src/pages/ProgressPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { getWorkouts } from "../lib/workouts";
import { getExercises } from "../lib/exerciseBank";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ProgressPage() {
  const [workouts, setWorkouts] = useState([]);
  const [exerciseBank, setExerciseBank] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Load workouts and exercise bank on mount
  useEffect(() => {
    setWorkouts(getWorkouts());
    setExerciseBank(getExercises()); // only use exercise bank for selector
  }, []);

  // Aggregate data: total volume per workout
  const aggregateData = useMemo(() => {
    return workouts.map((w) => {
      const totalVolume = (w.exercises || []).reduce((sum, ex) => {
        const exVolume = (ex.sets || []).reduce(
          (s, set) => s + (set.weight || 0) * (set.reps || 0),
          0
        );
        return sum + exVolume;
      }, 0);
      return { date: w.date, totalVolume };
    });
  }, [workouts]);

  // Exercise-specific data for graph
  const exerciseData = useMemo(() => {
    if (!selectedExercise) return [];
    const data = [];

    workouts.forEach((w) => {
      (w.exercises || []).forEach((ex) => {
        // Match by canonical exercise ID
        if (ex.id === selectedExercise.id) {
          const maxWeight = (ex.sets || []).reduce(
            (max, set) => Math.max(max, set.weight || 0),
            0
          );
          const totalVolume = (ex.sets || []).reduce(
            (sum, set) => sum + (set.weight || 0) * (set.reps || 0),
            0
          );
          data.push({ date: w.date, maxWeight, totalVolume });
        }
      });
    });

    // Sort by date
    return data.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [selectedExercise, workouts]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Progress</h1>

      {/* Aggregate Graph */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overall Progress</h2>
        {aggregateData.length === 0 ? (
          <p>No workout data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={aggregateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(d) => new Date(d).toLocaleDateString()}
              />
              <Line type="monotone" dataKey="totalVolume" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Exercise Selector */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Exercise:</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={selectedExercise?.id || ""}
          onChange={(e) => {
            const ex = exerciseBank.find((ex) => ex.id === e.target.value);
            setSelectedExercise(ex || null);
          }}
        >
          <option value="">-- Select Exercise --</option>
          {exerciseBank.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name} {ex.variation ? `(${ex.variation})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Exercise Graph */}
      {selectedExercise && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {selectedExercise.name} Progress
          </h2>
          {exerciseData.length === 0 ? (
            <p>No data for this exercise yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={exerciseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => new Date(d).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(d) => new Date(d).toLocaleDateString()}
                  formatter={(value, name) =>
                    name === "maxWeight"
                      ? `${value} lbs`
                      : `${value} total`
                  }
                />
                <Line type="monotone" dataKey="maxWeight" stroke="#82ca9d" />
                <Line type="monotone" dataKey="totalVolume" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </div>
  );
}





