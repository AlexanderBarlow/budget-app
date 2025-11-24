"use client";

import { useState } from "react";
import IncomeForm from "@/components/setup/IncomeForm";
import ExpenseForm from "@/components/setup/ExpenseForm";
import { motion } from "framer-motion";

export default function SetupPage() {
  const [step, setStep] = useState(1);

  return (
    <main className="min-h-screen bg-[#f6f9f8] px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-xl border border-[#e2e8f0] rounded-2xl p-10">
        {/* Header */}
        <h1 className="text-3xl font-bold text-[#1e293b] mb-4">
          Set Up Your Financial Profile
        </h1>
        <p className="text-[#475569] mb-8">
          FlowWise needs a little information to build your smart budget.
        </p>

        {/* Progress Indicator */}
        <div className="flex justify-between mb-10">
          <StepItem number={1} label="Income" active={step === 1} />
          <StepItem number={2} label="Expenses" active={step === 2} />
          <StepItem number={3} label="Finish" active={step === 3} />
        </div>

        {/* Step Content */}
        {step === 1 && <IncomeForm onContinue={() => setStep(2)} />}

        {step === 2 && (
          <ExpenseForm
            onContinue={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <h2 className="text-3xl font-semibold mb-4 text-[#1e293b]">
              You're All Set!
            </h2>
            <p className="text-[#475569] mb-6">
              Your dashboard will now show personalized insights based on the
              data you entered.
            </p>
            <a
              href="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-[#2dd4bf] to-[#3b82f6] text-white font-semibold rounded-xl shadow hover:opacity-90 transition"
            >
              Go to Dashboard
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
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold 
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
