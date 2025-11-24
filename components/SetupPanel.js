"use client";

import { useState } from "react";
import IncomeForm from "@/components/setup/IncomeForm";
import ExpenseForm from "@/components/setup/ExpenseForm";

export default function SetupPanel({ onClose }) {
  const [step, setStep] = useState(1);

  return (
    <div className="p-6">
      <button
        onClick={onClose}
        className="text-sm text-gray-500 underline mb-4"
      >
        Close
      </button>

      {step === 1 && <IncomeForm onContinue={() => setStep(2)} />}
      {step === 2 && (
        <ExpenseForm
          onBack={() => setStep(1)}
          onContinue={onClose} // close after done
        />
      )}
    </div>
  );
}
