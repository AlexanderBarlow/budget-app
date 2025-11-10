"use client";

import { motion } from "framer-motion";
import { Brain, TrendingUp, Target, Lightbulb } from "lucide-react";

export default function AIThinkingSection() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative px-6 md:px-20 py-24 bg-gradient-to-b from-[#f8fafc] to-[#e9eeec] text-center"
        >
            {/* Header */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#2dd4bf] to-[#3b82f6] bg-clip-text text-transparent mb-8"
            >
                How FlowWise Thinks
            </motion.h2>

            <p className="text-[#475569] max-w-2xl mx-auto mb-12">
                Behind every chart and forecast, FlowWise uses intelligent analysis to
                help you understand, adapt, and grow. Here’s how the system works to
                make budgeting effortless.
            </p>

            {/* AI Process Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Analyze */}
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-white/80 rounded-xl shadow-md border border-[#dbe3e1] p-6 text-left hover:shadow-lg transition-all"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-[#2dd4bf]/10 p-3 rounded-lg">
                            <Brain className="text-[#2dd4bf]" size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#1e293b]">
                            Analyze Patterns
                        </h3>
                    </div>
                    <p className="text-[#475569] text-sm leading-relaxed">
                        FlowWise reads your income, expenses, and goals to identify spending
                        habits and growth opportunities using adaptive logic.
                    </p>
                </motion.div>

                {/* Optimize */}
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-white/80 rounded-xl shadow-md border border-[#dbe3e1] p-6 text-left hover:shadow-lg transition-all"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-[#3b82f6]/10 p-3 rounded-lg">
                            <Lightbulb className="text-[#3b82f6]" size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#1e293b]">
                            Optimize Budgets
                        </h3>
                    </div>
                    <p className="text-[#475569] text-sm leading-relaxed">
                        The system adjusts your category budgets automatically — ensuring
                        you save effectively while keeping daily flexibility.
                    </p>
                </motion.div>

                {/* Grow */}
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-white/80 rounded-xl shadow-md border border-[#dbe3e1] p-6 text-left hover:shadow-lg transition-all"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-[#f59e0b]/10 p-3 rounded-lg">
                            <Target className="text-[#f59e0b]" size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#1e293b]">
                            Project Growth
                        </h3>
                    </div>
                    <p className="text-[#475569] text-sm leading-relaxed">
                        Using trend projections, FlowWise forecasts your savings and net
                        worth trajectory — turning financial goals into visible progress.
                    </p>
                </motion.div>
            </div>

            {/* Closing Line */}
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-16 text-[#475569] max-w-xl mx-auto text-base"
            >
                FlowWise doesn’t just track — it learns, adjusts, and helps you stay
                one step ahead.
            </motion.p>
        </motion.section>
    );
}
