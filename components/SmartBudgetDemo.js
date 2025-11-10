"use client";

import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign } from "lucide-react";

export default function SmartBudgetDemo() {
    const [income, setIncome] = useState("");
    const parsedIncome = parseFloat(income) || 0;

    // Budget model (can be made dynamic later)
    const budget = useMemo(
        () => [
            { name: "Needs (50%)", value: parsedIncome * 0.5, color: "#2dd4bf" },
            { name: "Wants (30%)", value: parsedIncome * 0.3, color: "#3b82f6" },
            { name: "Savings (20%)", value: parsedIncome * 0.2, color: "#fbbf24" },
        ],
        [parsedIncome]
    );

    const total = budget.reduce((sum, b) => sum + b.value, 0);

    return (
        <section className="relative py-24 bg-gradient-to-b from-[#f9fbfa] via-[#eef2f0] to-[#e9eeec] text-center px-6 overflow-hidden">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#2dd4bf] to-[#3b82f6] bg-clip-text text-transparent mb-4"
            >
                Try FlowWise Budgeting
            </motion.h2>

            <p className="text-[#475569] max-w-2xl mx-auto mb-8 text-base md:text-lg">
                Enter your monthly income to instantly see how FlowWise auto-allocates your budget using smart financial ratios.
            </p>

            {/* Income Input */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center gap-3 mb-10"
            >
                <div className="relative flex items-center border border-[#dbe3e1] bg-white/60 backdrop-blur-lg rounded-xl px-4 py-2 shadow-md w-72 focus-within:ring-2 focus-within:ring-[#2dd4bf]">
                    <DollarSign className="text-[#2dd4bf] mr-2" size={18} />
                    <input
                        type="number"
                        placeholder="Monthly income"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        className="bg-transparent w-full focus:outline-none text-[#1e293b] placeholder:text-[#94a3b8]"
                    />
                </div>
            </motion.div>

            {/* Chart Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full md:w-2/3 lg:w-1/2 mx-auto bg-white/70 dark:bg-[#1e293b]/60 backdrop-blur-xl border border-[#dbe3e1]/60 rounded-2xl shadow-xl p-8"
            >
                <div className="relative flex justify-center items-center h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={budget}
                                dataKey="value"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                stroke="none"
                            >
                                {budget.map((entry, i) => (
                                    <Cell key={`cell-${i}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value, name) =>
                                    `$${value.toLocaleString()} — ${name}`
                                }
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                    fontSize: "0.875rem",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center Text */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={parsedIncome}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4 }}
                            className="absolute text-center"
                        >
                            <p className="text-[#475569] text-sm">Monthly Total</p>
                            <h3 className="text-2xl font-bold text-[#1e293b]">
                                ${total.toLocaleString()}
                            </h3>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Budget Breakdown */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {budget.map((b, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-[#1e293b]/40 border border-[#e2e8f0]/70 rounded-xl py-4 px-2 shadow-sm"
                        >
                            <div
                                className="w-4 h-4 rounded-full mb-2"
                                style={{ backgroundColor: b.color }}
                            />
                            <h4 className="text-sm font-semibold text-[#1e293b] dark:text-white">
                                {b.name}
                            </h4>
                            <p className="text-[#475569] text-sm mt-1">
                                ${b.value.toLocaleString()}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
