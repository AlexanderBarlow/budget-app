"use client";

import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

const tabs = [
  { key: "overview", label: "Overview", path: "/dashboard" },
  { key: "cashflow", label: "Cash Flow", path: "/dashboard/cashflow" },
  { key: "expenses", label: "Expenses", path: "/dashboard/expenses" },
  { key: "personal", label: "Personal", path: "/dashboard/profile" },
  { key: "insights", label: "Insights", path: "/dashboard/insights" },
];

export default function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        fixed top-20 left-1/2 -translate-x-1/2
        z-40 backdrop-blur-xl bg-white/30 
        border border-white/40 shadow-2xl
        rounded-2xl px-8 py-3 
        flex items-center gap-6
      "
    >
      {tabs.map((tab) => {
        const active = pathname === tab.path;

        return (
          <button
            key={tab.key}
            onClick={() => router.push(tab.path)}
            className="relative px-3 py-1 font-medium text-gray-800"
          >
            {/* Animated pill for active state */}
            {active && (
              <motion.div
                layoutId="dashboard-pill"
                className="absolute inset-0 
                  bg-white/60 backdrop-blur-xl
                  rounded-lg shadow 
                  -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}

            <span
              className={active ? "font-semibold text-gray-900" : "opacity-70"}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </motion.nav>
  );
}
