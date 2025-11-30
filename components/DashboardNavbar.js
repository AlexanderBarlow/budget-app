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
    key: "accounts",
    label: "Accounts",
    icon: LineChart,
    path: "/dashboard/accounts",
  },
];

export default function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2
        z-50 w-[92%] max-w-lg
        bg-white/70 backdrop-blur-xl
        border border-white/40 shadow-2xl
        rounded-3xl px-4 py-3
        flex items-center justify-between gap-2
      "
    >
      {tabs.map((tab) => {
        const active = pathname === tab.path;
        const Icon = tab.icon;

        return (
          <button
            key={tab.key}
            onClick={() => router.push(tab.path)}
            className="
              relative flex flex-col items-center justify-center
              w-full py-2 rounded-xl
              transition-all
            "
          >
            {/* ACTIVE GLOW */}
            {active && (
              <motion.div
                layoutId="dashboard-pill"
                className="
                  absolute inset-0 rounded-xl
                  bg-white/80 shadow 
                "
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                }}
              />
            )}

            {/* ICON */}
            <Icon
              size={22}
              className={
                active
                  ? "text-[#0c2c35] drop-shadow-[0_0_6px_#4ef3e8]"
                  : "text-gray-600 opacity-70"
              }
            />

            {/* LABEL */}
            <span
              className={
                active
                  ? "mt-1 text-[11px] font-semibold text-[#0c2c35] drop-shadow-[0_0_6px_#4ef3e8]"
                  : "mt-1 text-[11px] text-gray-600 opacity-70"
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
