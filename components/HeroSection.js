"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="text-center py-28 px-6 gradient-bg">
            <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-6xl font-extrabold text-gradient"
            >
                Smarter Budgets. Brighter Future.
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-lg md:text-xl text-[#475569] max-w-2xl mx-auto mt-6"
            >
                FlowWise learns your habits, predicts your expenses, and helps your
                savings grow — automatically.
            </motion.p>
            <div className="flex justify-center gap-4 mt-8">
                <Link
                    href="/auth/sign-up"
                    className="bg-gradient-to-r from-[#2dd4bf] to-[#3b82f6] text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:scale-[1.02] transition-all"
                >
                    Get Started Free
                </Link>
                <Link
                    href="/auth/sign-in"
                    className="bg-white/70 text-[#1e293b] font-semibold px-8 py-3 rounded-lg border border-[#cbd5e1] hover:bg-white shadow-sm transition-all"
                >
                    Sign In
                </Link>
            </div>
        </section>
    );
}
