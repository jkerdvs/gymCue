export default function FiltersBar({
  search,
  setSearch,
  equipmentFilter,
  setEquipmentFilter,
  muscleFilter,
  setMuscleFilter,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <select
        value={equipmentFilter}
        onChange={(e) => setEquipmentFilter(e.target.value)}
        className="border rounded px-2 py-2"
      >
        <option value="All">All Equipment</option>
        {["Dumbbell", "Barbell", "Machine", "Cable", "Bodyweight"].map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>

      <select
        value={muscleFilter}
        onChange={(e) => setMuscleFilter(e.target.value)}
        className="border rounded px-2 py-2"
      >
        <option value="All">All Muscles</option>
        {[
          "Chest",
          "Back",
          "Shoulders",
          "Biceps",
          "Triceps",
          "Legs",
          "Core",
        ].map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search exercises"
        className="border rounded px-3 py-2 flex-1"
      />
    </div>
  );
}
