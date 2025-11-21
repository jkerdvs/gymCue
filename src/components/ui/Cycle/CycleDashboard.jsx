// src/components/Cycle/CycleDashboard.jsx
import React, { useEffect, useState } from "react";

export default function CycleDashboard() {
  const [cycle, setCycle] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("currentCycle");
    if (saved) setCycle(JSON.parse(saved));
  }, []);

  if (!cycle) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">No Active Cycle</h2>
        <p className="text-gray-500">Start a new bulk to begin tracking progress.</p>
      </div>
    );
  }

  const weekNumber = Math.ceil(
    (Date.now() - new Date(cycle.startDate)) / (1000 * 60 * 60 * 24 * 7)
  );

  const progress = ((cycle.workoutsCompleted / cycle.workoutsGoal) * 100).toFixed(0);
  const weightDiff = (cycle.currentWeight - cycle.startingWeight).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {cycle.name} — Week {weekNumber} of 8
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl shadow p-4 bg-white">
          <h2 className="text-lg font-semibold mb-2">Bodyweight</h2>
          <p className="text-2xl font-bold">{cycle.currentWeight} lbs</p>
          <p className="text-sm text-gray-500">Change: {weightDiff} lbs</p>
        </div>

        <div className="rounded-2xl shadow p-4 bg-white">
          <h2 className="text-lg font-semibold mb-2">Workouts</h2>
          <p className="text-2xl font-bold">
            {cycle.workoutsCompleted}/{cycle.workoutsGoal}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl shadow p-4 bg-white">
        <h2 className="text-lg font-semibold mb-2">Highlights</h2>
        {cycle.stats?.prList?.length ? (
          cycle.stats.prList.map((pr, i) => (
            <p key={i}>🏋️‍♂️ {pr}</p>
          ))
        ) : (
          <p className="text-gray-500">No PRs logged yet</p>
        )}
      </div>

      <div className="rounded-2xl shadow p-4 bg-white">
        <h2 className="text-lg font-semibold mb-2">Notes</h2>
        {cycle.notes?.length ? (
          cycle.notes.map((n, i) => (
            <p key={i} className="text-sm text-gray-700">
              {n.date}: {n.text}
            </p>
          ))
        ) : (
          <p className="text-gray-500">No notes yet</p>
        )}
      </div>
    </div>
  );
}
