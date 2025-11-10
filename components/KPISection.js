"use client";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { DollarSign, TrendingUp, PiggyBank } from "lucide-react";

export default function KPISection() {
    const kpis = [
        { title: "Net Worth", value: 62000, icon: <DollarSign />, prefix: "$" },
        { title: "Monthly Cash Flow", value: 1200, icon: <TrendingUp />, prefix: "+" },
        { title: "Savings Rate", value: 20, icon: <PiggyBank />, suffix: "%" },
        { title: "Retirement Growth", value: 8, icon: <TrendingUp />, suffix: "%/yr" },
    ];

    return (
        <section className="px-6 md:px-20 grid grid-cols-2 md:grid-cols-4 gap-8 py-20 bg-[#f8fafc]">
            {kpis.map((kpi, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-md hover:shadow-xl transition-all"
                >
                    <div className="flex items-center gap-2 text-[#2dd4bf]">{kpi.icon}</div>
                    <h3 className="text-sm text-[#64748b] mt-1">{kpi.title}</h3>
                    <p className="text-3xl font-bold text-[#1e293b]">
                        {kpi.prefix}
                        <CountUp end={kpi.value} duration={2.5} />
                        {kpi.suffix}
                    </p>
                </motion.div>
            ))}
        </section>
    );
}
