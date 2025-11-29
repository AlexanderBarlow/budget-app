"use client";

import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { Home, BarChart2, Wallet, User, LineChart } from "lucide-react";

const tabs = [
  { key: "overview", label: "Overview", icon: Home, path: "/dashboard" },
  {
    key: "cashflow",
    label: "Cash Flow",
    icon: BarChart2,
    path: "/dashboard/cashflow",
  },
  {
    key: "expenses",
    label: "Expenses",
    icon: Wallet,
    path: "/dashboard/expenses",
  },
  {
    key: "personal",
    label: "Personal",
    icon: User,
    path: "/dashboard/profile",
  },
  {
    key: "insights",
    label: "Insights",
    icon: LineChart,
    path: "/dashboard/insights",
  },
];

export default function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2
        z-50 w-[90%] max-w-md
        bg-white/70 backdrop-blur-xl
        border border-white/40 shadow-xl
        rounded-2xl px-4 py-2
        flex items-center justify-between
      "
    >
      {tabs.map((tab) => {
        const active = pathname === tab.path;
        const Icon = tab.icon;

        return (
          <button
            key={tab.key}
            onClick={() => router.push(tab.path)}
            className="relative flex flex-col items-center p-2 w-full text-xs"
          >
            {active && (
              <motion.div
                layoutId="dashboard-pill"
                className="absolute -inset-1 rounded-xl bg-white/80 shadow"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}

            <Icon
              size={20}
              className={active ? "text-gray-900" : "text-gray-600 opacity-70"}
            />

            <span
              className={
                active
                  ? "text-gray-900 font-semibold mt-1"
                  : "text-gray-600 opacity-70 mt-1"
              }
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </motion.nav>
  );
}
