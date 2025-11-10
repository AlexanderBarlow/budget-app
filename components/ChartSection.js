"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ResponsiveContainer } from "recharts";

export default function ChartSection({
    title,
    description,
    bullets = [],
    chart = null,
    reverse = false,
}) {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <section
            className={`flex flex-col md:flex-row ${reverse ? "md:flex-row-reverse" : ""
                } items-center gap-10 px-6 md:px-20 py-24 ${reverse ? "bg-[#eef2f0]" : "bg-[#f8fafc]"
                }`}
        >
            {/* Chart side */}
            <motion.div
                style={{ y }}
                className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-6 border border-[#e2e8f0] flex items-center justify-center"
            >
                {chart ? (
                    <ResponsiveContainer width="100%" height={300}>
                        {chart}
                    </ResponsiveContainer>
                ) : (
                    <p className="text-[#94a3b8] text-sm italic">
                        (Chart data coming soon...)
                    </p>
                )}
            </motion.div>

            {/* Text side */}
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="w-full md:w-1/2 space-y-4"
            >
                {title && <h2 className="text-3xl font-bold text-[#1e293b]">{title}</h2>}
                {description && <p className="text-[#475569]">{description}</p>}

                {bullets.length > 0 && (
                    <ul className="list-disc ml-5 text-[#475569] space-y-2">
                        {bullets.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                )}
            </motion.div>
        </section>
    );
}
