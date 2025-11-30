"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function CashFlowChart({ incomes, expenses }) {
  /* ----------------------------------------------------
     Prepare Chart Data (12 Month Projection)
  ---------------------------------------------------- */
  const chartData = useMemo(() => {
    if (!incomes || !expenses) return [];

    const monthlyIncome = incomes.reduce(
      (sum, inc) => sum + calculateMonthlyIncome(inc),
      0
    );

    const monthlyExpenses = expenses.reduce(
      (sum, exp) => sum + Number(exp.amount || 0),
      0
    );

    const net = monthlyIncome - monthlyExpenses;
    let runningBalance = 0;

    const months = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const now = new Date();
    const currentMonth = now.getMonth();

    for (let i = 0; i < 12; i++) {
      const m = (currentMonth + i) % 12;

      runningBalance += net;

      months.push({
        month: monthNames[m],
        income: Math.round(monthlyIncome),
        expenses: Math.round(monthlyExpenses),
        net: Math.round(net),
        balance: Math.round(runningBalance),
      });
    }

    return months;
  }, [incomes, expenses]);

  if (!chartData.length) {
    return <p className="text-gray-500 text-center">No data available.</p>;
  }

  return (
    <div className="w-full h-80 md:h-96 bg-white border rounded-2xl p-4 shadow">
      <h3 className="text-xl font-semibold text-[#1e293b] mb-4">
        12-Month Cash Flow Projection
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            {/* Income Gradient */}
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1} />
            </linearGradient>

            {/* Expense Gradient */}
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f87171" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="month" stroke="#475569" />
          <YAxis stroke="#475569" />

          <Tooltip
            formatter={(value) =>
              "$" +
              Number(value).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })
            }
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
            }}
          />

          {/* Income Area */}
          <Area
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            fill="url(#incomeGradient)"
            strokeWidth={2}
            name="Income"
          />

          {/* Expenses Area */}
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            fill="url(#expenseGradient)"
            strokeWidth={2}
            name="Expenses"
          />

          {/* Balance Line */}
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            name="Running Balance"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ----------------------------------------------------
   Monthly Income Calculator
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
