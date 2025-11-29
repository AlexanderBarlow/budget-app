"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import IncomeForm from "@/components/setup/IncomeForm";
import ExpenseForm from "@/components/setup/ExpenseForm";
import IncomeOverview from "@/components/IncomeOverview";

export default function PersonalPage() {
  const [activeForm, setActiveForm] = useState("income");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load the logged-in user
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

  if (loading) {
    return <p className="p-6 text-gray-500">Loading…</p>;
  }

  if (!userId) {
    return (
      <p className="p-6 text-red-500">
        You must be logged in to view this page.
      </p>
    );
  }

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-[#1e293b] mb-1">
        Personal Financial Data
      </h1>
      <p className="text-[#475569] mb-8">
        View, add, and update your financial details.
      </p>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveForm("income")}
          className={`px-4 py-2 rounded-xl text-sm md:text-base whitespace-nowrap transition
            ${
              activeForm === "income"
                ? "bg-gradient-to-r from-emerald-300 to-sky-300 text-gray-900 shadow"
                : "bg-white/70 backdrop-blur border border-gray-200 text-gray-700 hover:bg-white"
            }`}
        >
          Income
        </button>

        <button
          onClick={() => setActiveForm("expenses")}
          className={`px-4 py-2 rounded-xl text-sm md:text-base whitespace-nowrap transition
            ${
              activeForm === "expenses"
                ? "bg-gradient-to-r from-emerald-300 to-sky-300 text-gray-900 shadow"
                : "bg-white/70 backdrop-blur border border-gray-200 text-gray-700 hover:bg-white"
            }`}
        >
          Expenses
        </button>
      </div>

      {/* Content Wrapper */}
      <div className="bg-white p-5 md:p-6 border rounded-2xl shadow space-y-10">
        {/* ------------ INCOME TAB ------------ */}
        {activeForm === "income" && (
          <>
            {/* Income Summary */}
            <section>
              <h2 className="text-xl font-semibold text-[#1e293b] mb-3">
                Your Income Sources
              </h2>
              <IncomeOverview userId={userId} />
            </section>

            <hr className="border-gray-200" />

            {/* Add New Income */}
            <section>
              <h2 className="text-xl font-semibold text-[#1e293b] mb-3">
                Add New Income
              </h2>
              <IncomeForm userId={userId} onContinue={() => {}} />
            </section>
          </>
        )}

        {/* ------------ EXPENSE TAB ------------ */}
        {activeForm === "expenses" && (
          <section className="pb-4">
            <ExpenseForm
              userId={userId}
              onContinue={() => {}}
              onBack={() => setActiveForm("income")}
            />
          </section>
        )}
      </div>
    </div>
  );
}
