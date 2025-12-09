import React from "react";
import { Link } from "react-router-dom";

export default function SettingsDropdown({ onClose }) {
  return (
    <div 
      className="absolute right-6 top-16 bg-white/10 backdrop-blur-xl 
      border border-white/20 shadow-lg rounded-xl p-3 flex flex-col space-y-3 
      z-50"
    >
      <Link
        to="/exercise-bank"
        className="text-white hover:text-[#A78BFA] transition-colors"
        onClick={onClose}
      >
        Exercise Bank
      </Link>

      <Link
        to="/account"
        className="text-white hover:text-[#A78BFA] transition-colors"
        onClick={onClose}
      >
        Account
      </Link>

      <Link
        to="/preferences"
        className="text-white hover:text-[#A78BFA] transition-colors"
        onClick={onClose}
      >
        Preferences
      </Link>
    </div>
  );
}
