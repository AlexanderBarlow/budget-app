"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Import all your FlowWise sections
import ParallaxBackground from "@/components/ParallaxBackground";
import HeroSection from "@/components/HeroSection";
import KPISection from "@/components/KPISection";
import SmartBudgetDemo from "@/components/SmartBudgetDemo";
import HowItWorks from "@/components/HowItWorks";
import CashFlowSection from "@/components/CashFlowSection";
import RetirementSection from "@/components/RetirementSection";
import ChartSection from "@/components/ChartSection";
import AIThinkingSection from "@/components/AIThinkingSection";
import FooterSection from "@/components/FooterSection";
import NetWorthSection from "@/components/NetWorth";

// Example chart data for the ChartSection
const chartData = [
  { month: "Jan", income: 4200, expenses: 3100 },
  { month: "Feb", income: 4400, expenses: 3300 },
  { month: "Mar", income: 4700, expenses: 3500 },
  { month: "Apr", income: 4900, expenses: 3700 },
  { month: "May", income: 5200, expenses: 3900 },
  { month: "Jun", income: 5400, expenses: 4000 },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* Subtle animated background */}
      <ParallaxBackground />

      {/* Hero */}
      <HeroSection />

      {/* Key Metrics */}
      <KPISection />

      {/* AI Smart Budget Demo */}
      <SmartBudgetDemo />

      {/* How It Works */}
      <HowItWorks />

      {/* Cash Flow Forecast Section */}
      <CashFlowSection />

      {/* Retirement Growth Visualization */}
      <RetirementSection />

      {/* Net Worth Growth */}
      <NetWorthSection />

      {/* Dynamic Chart Example Section */}
      <ChartSection
        title="Cash Flow vs. Expenses"
        description="FlowWise provides a clear view of how your income and spending evolve together — empowering you to stay ahead of every financial curve."
        bullets={[
          "Visualize monthly balance trends",
          "Spot spending spikes before they grow",
          "Plan smarter with AI-powered forecasting",
        ]}
        chart={
          <LineChart data={chartData}>
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "0.875rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#2dd4bf"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        }
      />

      {/* AI Financial Intelligence Section */}
      <AIThinkingSection />

      {/* Footer */}
      <FooterSection />
    </main>
  );
}
