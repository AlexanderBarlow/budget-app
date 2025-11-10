"use client";
import { motion } from "framer-motion";
import { Brain, PieChart, Rocket } from "lucide-react";

const steps = [
    { icon: <Brain />, title: "Analyze", desc: "FlowWise learns your income, habits, and spending patterns." },
    { icon: <PieChart />, title: "Optimize", desc: "We auto-create dynamic budgets that evolve with your life." },
    { icon: <Rocket />, title: "Grow", desc: "Track your progress, hit milestones, and plan your financial future." },
];

export default function HowItWorks() {
    return (
        <section className="py-24 bg-[#eef2f0] text-center px-6">
            <h2 className="text-3xl font-bold mb-10">How FlowWise Works</h2>
            <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                {steps.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-xl border border-[#e2e8f0] shadow-lg p-6 hover:shadow-xl transition"
                    >
                        <div className="text-[#2dd4bf] text-3xl mb-4 flex justify-center">{s.icon}</div>
                        <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                        <p className="text-[#475569] text-sm">{s.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
