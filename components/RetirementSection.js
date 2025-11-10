"use client";

import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const retirementData = Array.from({ length: 10 }).map((_, i) => ({
    year: 2025 + i,
    value: 10000 * Math.pow(1.07, i), // 7% growth per year
}));

export default function RetirementSection() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-10 px-6 md:px-20 py-24 bg-[#f8fafc]"
        >
            {/* Chart (left) */}
            <div className="w-full md:w-1/2 bg-white rounded-xl border border-[#e2e8f0] shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#1e293b]">
                    Retirement Growth Projection
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={retirementData}>
                        <XAxis dataKey="year" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Description (right) */}
            <div className="w-full md:w-1/2 space-y-4">
                <h2 className="text-3xl font-bold text-[#1e293b]">
                    Plan for the Future — Automatically
                </h2>
                <p className="text-[#475569]">
                    FlowWise projects your retirement growth using compound interest
                    models, based on your current savings, contributions, and time horizon.
                </p>
                <ul className="list-disc ml-5 text-[#475569] space-y-2">
                    <li>Visualize how your savings can grow over time</li>
                    <li>See the impact of increasing contributions</li>
                    <li>Get realistic retirement projections in real-time</li>
                </ul>
            </div>
        </motion.section>
    );
}
