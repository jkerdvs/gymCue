import React from "react";

export default function SaveTemplateModal({ visible, onClose, onSave }) {
  const [name, setName] = React.useState("");

  if (!visible) return null;

  const handleBackgroundClick = (e) => {
    if (e.target.id === "modalBackground") onClose();
  };

  return (
    <div
      id="modalBackground"
      onClick={handleBackgroundClick}
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-end z-50"
    >
      <div className="w-full bg-white rounded-t-2xl p-6 shadow-xl animate-slideUp">
        <h2 className="text-xl font-semibold mb-4">Save as New Template</h2>

        <input
          className="w-full px-3 py-2 border rounded-lg mb-4"
          placeholder="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium mb-2"
          onClick={() => {
            if (name.trim().length === 0) return;
            onSave(name);
          }}
        >
          Save
        </button>

        <button
          className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg font-medium"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
