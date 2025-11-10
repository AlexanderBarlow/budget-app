"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PiggyBank, TrendingUp, DollarSign } from "lucide-react";

export default function ParallaxBackground() {
    const ref = useRef(null);
    const { scrollY } = useScroll();

    // Different scroll speeds for parallax layers
    const y1 = useTransform(scrollY, [0, 800], [0, -100]);
    const y2 = useTransform(scrollY, [0, 800], [0, -50]);
    const y3 = useTransform(scrollY, [0, 800], [0, -25]);

    return (
        <div
            ref={ref}
            className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
        >
            {/* Soft gradient background */}
            <motion.div
                style={{ y: y3 }}
                className="absolute inset-0 bg-gradient-to-b from-[#f9fbfa] via-[#eef2f0] to-[#e3e9e8]"
            />

            {/* Floating icons */}
            <motion.div
                style={{ y: y1 }}
                className="absolute top-[10%] left-[5%] text-[#74c69d]/20"
            >
                <PiggyBank size={120} />
            </motion.div>

            <motion.div
                style={{ y: y2 }}
                className="absolute top-[30%] right-[10%] text-[#3b82f6]/20"
            >
                <TrendingUp size={100} />
            </motion.div>

            <motion.div
                style={{ y: y3 }}
                className="absolute bottom-[15%] left-[15%] text-[#2dd4bf]/20"
            >
                <DollarSign size={90} />
            </motion.div>

            {/* Ambient circles for extra depth */}
            <motion.div
                style={{ y: y1 }}
                className="absolute top-[60%] right-[25%] w-48 h-48 bg-[#a7f3d0]/20 rounded-full blur-3xl"
            />
            <motion.div
                style={{ y: y2 }}
                className="absolute bottom-[20%] left-[20%] w-64 h-64 bg-[#93c5fd]/20 rounded-full blur-3xl"
            />
        </div>
    );
}
