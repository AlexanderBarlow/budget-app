"use client";

import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const cashFlowData = [
    { month: "Jan", income: 4200, expenses: 3100 },
    { month: "Feb", income: 4400, expenses: 3300 },
    { month: "Mar", income: 4700, expenses: 3500 },
    { month: "Apr", income: 4900, expenses: 3700 },
    { month: "May", income: 5200, expenses: 3900 },
    { month: "Jun", income: 5400, expenses: 4000 },
];

export default function CashFlowSection() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-10 px-6 md:px-20 py-24 bg-[#eef2f0]"
        >
            {/* Chart (left) */}
            <div className="w-full md:w-1/2 bg-white rounded-xl border border-[#e2e8f0] shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#1e293b]">
                    Cash Flow Forecast
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={cashFlowData}>
                        <defs>
                            <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                fontSize: "0.875rem",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#2dd4bf"
                            fill="url(#income)"
                            strokeWidth={3}
                        />
                        <Area
                            type="monotone"
                            dataKey="expenses"
                            stroke="#f43f5e"
                            fill="url(#expenses)"
                            strokeWidth={3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Description (right) */}
            <div className="w-full md:w-1/2 space-y-4">
                <h2 className="text-3xl font-bold text-[#1e293b]">
                    Predict Your Financial Flow
                </h2>
                <p className="text-[#475569]">
                    FlowWise uses your historical income and spending patterns to forecast
                    future balances — helping you stay ahead of financial surprises.
                </p>
                <ul className="list-disc ml-5 text-[#475569] space-y-2">
                    <li>Visualize your projected income and expenses over time</li>
                    <li>Spot trends before they impact your budget</li>
                    <li>Gain confidence knowing what’s coming next</li>
                </ul>
            </div>
        </motion.section>
    );
}
