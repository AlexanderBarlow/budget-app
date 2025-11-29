"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // <-- REUSE IT HERE

import IncomeForm from "@/components/setup/IncomeForm";
import ExpenseForm from "@/components/setup/ExpenseForm";

export default function PersonalPage() {
  const [activeForm, setActiveForm] = useState("income");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (!userId) return <p>You must be logged in.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1e293b] mb-2">
        Personal Financial Data
      </h1>

      <p className="text-[#475569] mb-6">Update your income and expenses.</p>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveForm("income")}
          className={`px-4 py-2 rounded-xl ${
            activeForm === "income" ? "bg-emerald-300" : "bg-gray-100"
          }`}
        >
          Income
        </button>

        <button
          onClick={() => setActiveForm("expenses")}
          className={`px-4 py-2 rounded-xl ${
            activeForm === "expenses" ? "bg-emerald-300" : "bg-gray-100"
          }`}
        >
          Expenses
        </button>
      </div>

      <div className="bg-white p-6 border rounded-2xl shadow-md">
        {activeForm === "income" && (
          <IncomeForm userId={userId} onContinue={() => {}} />
        )}

        {activeForm === "expenses" && (
          <ExpenseForm
            userId={userId}
            onContinue={() => {}}
            onBack={() => setActiveForm("income")}
          />
        )}
      </div>
    </div>
  );
}
