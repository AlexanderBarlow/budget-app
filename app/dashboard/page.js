"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// CHARTS (you’ll create these in /components/charts)
import CashFlowChart from "@/components/charts/CashFlowChart";
import SpendingPieChart from "@/components/charts/SpendingPieChart";

// ICONS
import { Wallet, Calendar, TrendingUp, PiggyBank } from "lucide-react";

export default function DashboardHome() {
  const [userId, setUserId] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Load Auth User */
  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) setUserId(session.user.id);
    })();
  }, []);

  /* Load Dashboard Data */
  useEffect(() => {
    if (!userId) return;
    loadDashboardData();
  }, [userId]);

  async function loadDashboardData() {
    const [incRes, expRes, accRes] = await Promise.all([
      fetch(`/api/income?userId=${userId}`),
      fetch(`/api/expenses?userId=${userId}`),
      fetch(`/api/accounts?userId=${userId}`),
    ]);

    setIncomes(incRes.ok ? await incRes.json() : []);
    setExpenses(expRes.ok ? await expRes.json() : []);
    setAccounts(accRes.ok ? await accRes.json() : []);

    setLoading(false);
  }

  if (loading) {
    return <p className="text-gray-400 text-center mt-6">Loading dashboard…</p>;
  }

  /* --- CALCULATED METRICS --- */
  const monthlyIncome = calcMonthlyIncome(incomes);
  const monthlyExpenses = calcMonthlyExpenses(expenses);
  const savingsRate =
    monthlyIncome > 0
      ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
      : 0;
  const netWorth = accounts.reduce((sum, a) => sum + Number(a.balance), 0);

  const upcomingBills = expenses
    .filter((e) => e.nextCharge)
    .sort((a, b) => new Date(a.nextCharge) - new Date(b.nextCharge))
    .slice(0, 4);

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-bold text-[#1e293b]">Overview</h1>
        <p className="text-[#475569] mt-1">
          Your complete financial snapshot and upcoming money movements.
        </p>
      </header>

      {/* KPI GRID */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI
          icon={<TrendingUp size={20} />}
          label="Net Worth"
          value={`$${netWorth.toLocaleString()}`}
          color="text-emerald-600"
        />
        <KPI
          icon={<Wallet size={20} />}
          label="Monthly Income"
          value={`$${monthlyIncome.toLocaleString()}`}
          color="text-blue-600"
        />
        <KPI
          icon={<Wallet size={20} />}
          label="Monthly Expenses"
          value={`$${monthlyExpenses.toLocaleString()}`}
          color="text-red-600"
        />
        <KPI
          icon={<PiggyBank size={20} />}
          label="Savings Rate"
          value={`${savingsRate.toFixed(0)}%`}
          color="text-indigo-600"
        />
      </section>

      {/* CASH FLOW CHART */}
      <section className="bg-white border rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          12-Month Cash Flow Projection
        </h2>
        <CashFlowChart incomes={incomes} expenses={expenses} />
      </section>

      {/* SPENDING PIE */}
      <section className="bg-white border rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Spending Breakdown
        </h2>
        <SpendingPieChart expenses={expenses} />
      </section>

      {/* UPCOMING BILLS */}
      <section className="bg-white border rounded-2xl shadow p-5 space-y-4">
        <h2 className="text-lg font-semibold text-[#1e293b]">Upcoming Bills</h2>

        {upcomingBills.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming bills.</p>
        ) : (
          upcomingBills.map((bill) => (
            <div
              key={bill.id}
              className="flex justify-between items-center border-b last:border-b-0 pb-3"
            >
              <div>
                <p className="font-medium text-[#0f172a]">{bill.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(bill.nextCharge).toLocaleDateString()}
                </p>
              </div>
              <p className="font-semibold text-[#0f766e]">
                ${Number(bill.amount).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </section>

      {/* AI INSIGHTS */}
      <AIInsights
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
      />
    </div>
  );
}

/* -----------------------------
   KPI COMPONENT
----------------------------- */
function KPI({ icon, label, value, color }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow flex flex-col gap-1">
      <div className={`flex items-center gap-2 ${color} font-semibold`}>
        {icon}
        {label}
      </div>
      <p className="text-xl font-bold text-[#0f172a]">{value}</p>
    </div>
  );
}

/* -----------------------------
   AI INSIGHTS SECTION
----------------------------- */
function AIInsights({ monthlyIncome, monthlyExpenses }) {
  const diff = monthlyIncome - monthlyExpenses;

  return (
    <section className="bg-white border rounded-2xl shadow p-5 space-y-3">
      <h2 className="text-lg font-semibold text-[#1e293b]">Insights</h2>

      {diff >= 0 ? (
        <p className="text-emerald-700 text-sm">
          👍 You are cash-flow positive by{" "}
          <strong>${diff.toLocaleString()}</strong> this month.
        </p>
      ) : (
        <p className="text-red-700 text-sm">
          ⚠️ You are overspending by{" "}
          <strong>${Math.abs(diff).toLocaleString()}</strong>. Consider
          reviewing your expense categories.
        </p>
      )}
    </section>
  );
}

/* -----------------------------
   HELPERS
----------------------------- */
function calcMonthlyIncome(incomes) {
  return incomes.reduce((sum, inc) => {
    if (inc.salaryAnnual) return sum + inc.salaryAnnual / 12;
    if (inc.hourlyRate)
      return sum + inc.hourlyRate * 4.33 * (inc.hoursPerWeek || 40);
    return sum;
  }, 0);
}

function calcMonthlyExpenses(expenses) {
  return expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
}
