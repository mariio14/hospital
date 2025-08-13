import React, { useState } from "react";
import { AnnualPlanning, MonthlyPlanning, WeeklyPlanning } from "../../plannings";
import { motion, AnimatePresence } from "framer-motion";
import "../../../styles/Home.css";

const tabs = [
  { id: "annual", label: "Planificación Anual", component: <AnnualPlanning /> },
  { id: "monthly", label: "Planificación Mensual", component: <MonthlyPlanning /> },
  { id: "weekly", label: "Planificación Semanal", component: <WeeklyPlanning /> },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState("annual");

  return (
    <div className="p-6 w-full flex flex-col items-center">
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-5 py-3 rounded-lg border transition-all duration-300 text-sm font-medium text-center
              ${activeTab === tab.id
                ? "bg-white border-blue-400 text-blue-600 shadow-lg scale-105"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido con animación */}
      <div className="relative bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {tabs.find((t) => t.id === activeTab)?.component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;
