import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CgAlignRight } from "react-icons/cg";
import SettingsDropdown from "./SettingsDropdown";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Close dropdown when navigating to a different route
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/progress", label: "Progress" },
    { to: "/workout-log", label: "Workout Log" },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 
      bg-white/10 backdrop-blur-lg text-white shadow-md border-b border-white/20">

      {/* Brand */}
      <h1 className="text-2xl font-bold tracking-wide text-white">
        <span className="text-[#8B5CF6]">gym</span>Cue
      </h1>

      {/* Center Links */}
      <div className="flex space-x-6">
        {links.map(({ to, label }) => {
          const isActive = location.pathname === to;

          return (
            <Link
              key={to}
              to={to}
              className={`relative font-medium transition-colors duration-200 ${
                isActive
                  ? "text-[#8B5CF6]"
                  : "text-white hover:text-[#A78BFA]"
              }`}
            >
              {label}
              {isActive && (
                <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#8B5CF6] rounded-full"></span>
              )}
            </Link>
          );
        })}
      </div>

      {/* SETTINGS ICON + DROPDOWN */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="text-white hover:text-[#A78BFA] transition-colors duration-200"
        >
          <CgAlignRight size={26} />
        </button>

        {open && (
          <SettingsDropdown onClose={() => setOpen(false)} />
        )}
      </div>
    </nav>
  );
}


