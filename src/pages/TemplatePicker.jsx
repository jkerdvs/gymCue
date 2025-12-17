// src/pages/TemplatePicker.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TemplatePicker() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("templates")) || {};
    const arr = Object.entries(stored).map(([name, data]) => ({ id: name, ...data }));
    setTemplates(arr);
  }, []);

  const handleSelect = (template) => {
    const stored = JSON.parse(localStorage.getItem("templates")) || {};
    const workoutData = stored[template.id];
    if (!workoutData) return alert("Template not found");

    navigate("/workout", {
      state: {
        templateName: template.id, // pass name for editing
        workoutData,
      },
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Choose a Template
      </h1>

      {templates.length === 0 && (
        <p className="text-center text-gray-500">No templates found.</p>
      )}

      <div className="flex flex-col gap-4 mt-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelect(template)}
            className="w-full p-4 bg-gray-800 text-white rounded-xl text-lg shadow active:scale-95"
          >
            {template.id}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-10 w-full p-3 text-gray-600 underline text-center"
      >
        Back
      </button>
    </div>
  );
}

