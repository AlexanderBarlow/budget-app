"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import IncomeForm from "@/components/setup/IncomeForm";
import ExpenseForm from "@/components/setup/ExpenseForm";

export default function FinancialSetupWizard({ onClose }) {
  const [step, setStep] = useState(1);

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      className="p-2"
    >
      <h1 className="text-2xl font-bold text-[#1e293b] mb-4">
        Update Your Financial Info
      </h1>

      {/* Step indicator */}
      <div className="flex justify-between mb-6">
        <StepItem number={1} label="Income" active={step === 1} />
        <StepItem number={2} label="Expenses" active={step === 2} />
        <StepItem number={3} label="Finish" active={step === 3} />
      </div>

      {step === 1 && <IncomeForm onContinue={() => setStep(2)} />}
      {step === 2 && (
        <ExpenseForm onBack={() => setStep(1)} onContinue={() => setStep(3)} />
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <h2 className="text-xl font-semibold mb-3">All Set!</h2>
          <p className="text-[#475569] mb-4">
            Your dashboard will update based on your new info.
          </p>

          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-[#2dd4bf] to-[#3b82f6] text-white rounded-xl shadow hover:opacity-90 transition"
          >
            Return to Dashboard
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

function StepItem({ number, label, active }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white 
        ${active ? "bg-[#2dd4bf]" : "bg-[#cbd5e1]"}`}
      >
        {number}
      </div>
      <p
        className={`text-sm mt-1 ${
          active ? "text-[#2dd4bf]" : "text-[#94a3b8]"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
