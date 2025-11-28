"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Lazy load the large forms only when needed
const IncomeForm = dynamic(() => import("@/components/setup/IncomeForm"), {
  ssr: false,
  loading: () => <div>Loading income form…</div>,
});
const ExpenseForm = dynamic(() => import("@/components/setup/ExpenseForm"), {
  ssr: false,
  loading: () => <div>Loading expenses…</div>,
});

export default function SetupPage() {
  const [step, setStep] = useState(1);

  return (
    <main className="min-h-screen bg-[#f6f9f8] px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-xl border border-[#e2e8f0] rounded-2xl p-10">
        {/* Header */}
        <h1 className="text-3xl font-bold text-[#1e293b] mb-4">
          Update Your Financial Info
        </h1>
        <p className="text-[#475569] mb-8">
          FlowWise uses this info to personalize your dashboard.
        </p>

        {/* Step Indicators */}
        <div className="flex justify-between mb-10">
          <StepItem number={1} label="Income" active={step === 1} />
          <StepItem number={2} label="Expenses" active={step === 2} />
          <StepItem number={3} label="Finish" active={step === 3} />
        </div>

        {/* Steps */}
        <Suspense fallback={<div>Loading…</div>}>
          {step === 1 && <IncomeForm onContinue={() => setStep(2)} />}
          {step === 2 && (
            <ExpenseForm
              onBack={() => setStep(1)}
              onContinue={() => setStep(3)}
            />
          )}
        </Suspense>

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10"
          >
            <h2 className="text-3xl font-semibold mb-4 text-[#1e293b]">
              All Set!
            </h2>
            <p className="text-[#475569] mb-6">
              Your dashboard will update based on the information you entered.
            </p>

            <a
              href="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-[#2dd4bf] to-[#3b82f6] text-white rounded-xl font-semibold shadow hover:opacity-90 transition"
            >
              Return to Dashboard
            </a>
          </motion.div>
        )}
      </div>
    </main>
  );
}

function StepItem({ number, label, active }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white 
        ${active ? "bg-[#2dd4bf]" : "bg-[#cbd5e1]"}`}
      >
        {number}
      </div>
      <p
        className={`mt-2 text-sm ${
          active ? "text-[#2dd4bf]" : "text-[#94a3b8]"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
