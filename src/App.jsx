import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProgressPage from "./pages/ProgressPage";
import WorkoutLog from "./pages/WorkoutLog";
import CycleDashboard from "./components/ui/Cycle/CycleDashboard";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#60A5FA] text-white font-sans transition-colors duration-300">
        {/* Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow p-6 bg-white/10 backdrop-blur-md shadow-xl rounded-t-3xl border-t border-white/20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/workout-log" element={<WorkoutLog />} />
            <Route path="/dashboard" element={<CycleDashboard />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-white/70 text-sm bg-white/10 backdrop-blur-sm border-t border-white/20">
          gymCue © {new Date().getFullYear()}
        </footer>
      </div>
    </Router>
  );
}


