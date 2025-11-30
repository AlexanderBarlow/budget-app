"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Wallet,
  DollarSign,
  PiggyBank,
} from "lucide-react";
import CashFlowChart from "@/components/charts/CashFlowChart";

export default function CashFlowPage() {
  const [userId, setUserId] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ----------------------------------------------------
      Load User
  ---------------------------------------------------- */
  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);
      }
    }

    loadUser();
  }, []);

  /* ----------------------------------------------------
      Load Income + Expenses + Accounts
  ---------------------------------------------------- */
  useEffect(() => {
    if (!userId) return;

    async function loadData() {
      try {
        const [incomeRes, expenseRes, accountsRes] = await Promise.all([
          fetch(`/api/income?userId=${userId}`),
          fetch(`/api/expenses?userId=${userId}`),
          fetch(`/api/accounts?userId=${userId}`),
        ]);

        const incomeData = incomeRes.ok ? await incomeRes.json() : [];
        const expenseData = expenseRes.ok ? await expenseRes.json() : [];
        const accountData = accountsRes.ok ? await accountsRes.json() : [];

        // Attach paycheck amounts for predicted dates
        const enrichedIncomes = incomeData.map((inc) => ({
          ...inc,
          paycheckAmount: estimatePaycheck(inc),
        }));

        setIncomes(enrichedIncomes);
        setExpenses(expenseData);
        setAccounts(accountData);
      } catch (err) {
        console.error("Cash flow load error:", err);
      }

      setLoading(false);
    }

    loadData();
  }, [userId]);

  if (loading) return <p className="p-6 text-gray-500">Loading cash flow...</p>;

  /* ----------------------------------------------------
      Monthly Flow Calculations
  ---------------------------------------------------- */
  const monthlyIncome = incomes.reduce(
    (sum, i) => sum + calculateMonthlyIncome(i),
    0
  );
  const monthlyExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );
  const monthlyBalance = monthlyIncome - monthlyExpenses;

  /* ----------------------------------------------------
      Assets (Total Account Balances)
  ---------------------------------------------------- */
  const totalAssets = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance || 0),
    0
  );

  /* ----------------------------------------------------
      NET WORTH = Assets + Monthly Flow
  ---------------------------------------------------- */
  const netWorth = totalAssets + monthlyBalance;

  const netWorthColor =
    netWorth > 0
      ? "text-green-600"
      : netWorth < 0
      ? "text-red-600"
      : "text-yellow-600";

  const balanceColor =
    monthlyBalance > 0
      ? "text-green-600"
      : monthlyBalance < 0
      ? "text-red-600"
      : "text-yellow-600";

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-bold text-[#1e293b] mb-1">Cash Flow</h1>
        <p className="text-[#475569]">
          Track income, expenses, assets, and projected paychecks.
        </p>
      </header>

      {/* SUMMARY CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          icon={<ArrowUp className="text-green-600" />}
          label="Monthly Income"
          value={monthlyIncome}
          color="text-green-600"
        />
        <SummaryCard
          icon={<ArrowDown className="text-red-600" />}
          label="Monthly Expenses"
          value={monthlyExpenses}
          color="text-red-600"
        />
        <SummaryCard
          icon={<Wallet className={balanceColor} />}
          label="Monthly Net"
          value={monthlyBalance}
          color={balanceColor}
        />
        <SummaryCard
          icon={<PiggyBank className={netWorthColor} />}
          label="Net Worth"
          value={netWorth}
          color={netWorthColor}
        />
      </section>

      {/* UPCOMING PAYCHECKS */}
      <section className="bg-white border rounded-2xl p-5 shadow">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-[#1e293b]">
          <Calendar size={20} /> Upcoming Paychecks
        </h2>

        {incomes.length === 0 ? (
          <p className="text-gray-500">No income sources found.</p>
        ) : (
          <div className="space-y-4">
            {incomes.map((income) => (
              <div
                key={income.id}
                className="border p-4 rounded-xl bg-[#f8fafc] space-y-2"
              >
                <p className="font-semibold text-[#1e293b]">
                  {income.incomeSource}
                </p>

                {income.predictedDates?.length > 0 ? (
                  <ul className="mt-1 text-sm text-gray-600 space-y-1">
                    {income.predictedDates.slice(0, 3).map((d, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center bg-white border rounded-lg p-2"
                      >
                        <span>📅 {formatDate(d)}</span>
                        <span className="font-medium text-[#0f766e] flex items-center gap-1">
                          <DollarSign size={16} />
                          {formatMoney(income.paycheckAmount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm mt-2">
                    Not enough data to predict pay dates.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CASH FLOW CHART */}
      <section className="bg-white border rounded-2xl p-5 shadow">
        <CashFlowChart incomes={incomes} expenses={expenses} />
      </section>
    </div>
  );
}

/* ----------------------------------------------------
  (helpers unchanged from your page)
---------------------------------------------------- */
function calculateMonthlyIncome(income) {
  const {
    incomeType,
    salaryAnnual,
    tips,
    commission,
    bonuses,
    hoursPerWeek,
    hourlyRate,
  } = income;

  let monthly = 0;
  if (incomeType === "SALARY") {
    if (salaryAnnual) monthly += salaryAnnual / 12;
    if (commission) monthly += Number(commission);
    if (bonuses) monthly += Number(bonuses) / 12;
  }
  if (incomeType === "HOURLY") {
    const weekly =
      Number(hourlyRate || 0) * Number(hoursPerWeek || 0) +
      Number(tips || 0) / 4;
    monthly += weekly * 4.33;
  }
  return monthly;
}

function estimatePaycheck(income) {
  const { incomeType, salaryAnnual, hourlyRate, hoursPerWeek, payFrequency } =
    income;

  if (incomeType === "SALARY") {
    switch (payFrequency) {
      case "WEEKLY":
        return salaryAnnual / 52;
      case "BIWEEKLY":
        return salaryAnnual / 26;
      case "SEMIMONTHLY":
        return salaryAnnual / 24;
      case "MONTHLY":
      default:
        return salaryAnnual / 12;
    }
  }

  if (incomeType === "HOURLY") {
    const weekly = hourlyRate * hoursPerWeek;
    switch (payFrequency) {
      case "WEEKLY":
        return weekly;
      case "BIWEEKLY":
        return weekly * 2;
      case "SEMIMONTHLY":
        return (weekly * 52) / 24;
      case "MONTHLY":
      default:
        return weekly * 4.33;
    }
  }

  return 0;
}

function formatMoney(amount) {
  return `$${Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SummaryCard({ icon, label, value, color }) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow flex flex-col gap-1">
      <div className="flex items-center gap-2 text-[#475569]">
        {icon}
        <p className="font-medium">{label}</p>
      </div>

      <p className={`text-2xl font-bold ${color}`}>{formatMoney(value)}</p>
    </div>
  );
}
