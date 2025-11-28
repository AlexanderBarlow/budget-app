"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const tabs = [
    { id: "overview", label: "Overview" },
    { id: "cashflow", label: "Cash Flow" },
    { id: "expenses", label: "Expenses" },
    { id: "profile", label: "Personal Data" },
];

export default function DashboardNav({ activeTab, setActiveTab }) {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="
         fixed top-20 left-1/2 -translate-x-1/2
         z-40 bg-white/80 backdrop-blur-xl
         shadow-xl rounded-2xl px-6 py-3
         flex items-center gap-6 border border-gray-200
      "
        >
            {tabs.map((tab) => {
                const active = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="relative px-2 py-1 font-medium text-gray-700"
                    >
                        {/* Active highlight animation */}
                        {active && (
                            <motion.div
                                layoutId="dashnav-pill"
                                className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-sky-300 rounded-lg -z-10 drop-shadow"
                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            />
                        )}

                        <span className={active ? "text-gray-900 font-semibold" : ""}>
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </motion.nav>
    );
}
