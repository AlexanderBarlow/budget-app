"use client";

import { useState } from "react";
import IncomeForm from "@/components/setup/IncomeForm";
import ExpenseForm from "@/components/setup/ExpenseForm";

export default function PersonalPage() {
  const [activeForm, setActiveForm] = useState("income");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1e293b] mb-2">
        Personal Financial Data
      </h1>
      <p className="text-[#475569] mb-6">
        Update your income, expenses, and financial profile.
      </p>

      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveForm("income")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            activeForm === "income"
              ? "bg-gradient-to-r from-emerald-300 to-sky-300 text-gray-900 shadow"
              : "bg-white/70 backdrop-blur border border-gray-200 text-gray-600 hover:bg-white"
          }`}
        >
          Income
        </button>

        <button
          onClick={() => setActiveForm("expenses")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            activeForm === "expenses"
              ? "bg-gradient-to-r from-emerald-300 to-sky-300 text-gray-900 shadow"
              : "bg-white/70 backdrop-blur border border-gray-200 text-gray-600 hover:bg-white"
          }`}
        >
          Expenses
        </button>
      </div>

      {/* Render Forms */}
      <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-md">
        {activeForm === "income" && (
          <IncomeForm onContinue={() => {}} noButtons />
        )}

        {activeForm === "expenses" && (
          <ExpenseForm onContinue={() => {}} onBack={() => {}} noButtons />
        )}
      </div>
    </div>
  );
}
