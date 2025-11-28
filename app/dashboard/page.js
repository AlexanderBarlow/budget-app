"use client";

import KPISection from "@/components/KPISection";
import CashFlowSection from "@/components/CashFlowSection";
import NetWorthSection from "@/components/NetWorth";
import RetirementSection from "@/components/RetirementSection";

export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1e293b] mb-6">Overview</h1>

      <KPISection />
      <CashFlowSection />
      <NetWorthSection />
      <RetirementSection />
    </div>
  );
}
