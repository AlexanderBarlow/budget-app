"use client";

import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const netWorthData = [
    { year: "2020", networth: 15000 },
    { year: "2021", networth: 26000 },
    { year: "2022", networth: 36000 },
    { year: "2023", networth: 47000 },
    { year: "2024", networth: 62000 },
];

export default function NetWorthSection() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row-reverse items-center gap-10 px-6 md:px-20 py-24 bg-[#eef2f0]"
        >
            {/* Chart (right) */}
            <div className="w-full md:w-1/2 bg-[#1e293b] rounded-xl border border-[#334155] shadow-xl p-6 text-white">
                <h2 className="text-xl font-semibold mb-4">Net Worth Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={netWorthData}>
                        <XAxis dataKey="year" stroke="#cbd5e1" />
                        <YAxis stroke="#cbd5e1" />
                        <Tooltip />
                        <Bar dataKey="networth" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Description (left) */}
            <div className="w-full md:w-1/2 space-y-4">
                <h2 className="text-3xl font-bold text-[#1e293b]">
                    Visualize Your Financial Growth
                </h2>
                <p className="text-[#475569]">
                    Track your net worth and financial momentum over time — see how each
                    smart decision contributes to your long-term success.
                </p>
                <ul className="list-disc ml-5 text-[#475569] space-y-2">
                    <li>Compare year-over-year progress</li>
                    <li>Identify growth plateaus and new opportunities</li>
                    <li>Understand how your assets and savings evolve</li>
                </ul>
            </div>
        </motion.section>
    );
}
