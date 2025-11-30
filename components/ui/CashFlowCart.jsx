"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function CashFlowChart({ incomes, expenses }) {
  /* ---------------------------------------------
      Build 12-month projection dataset
  ---------------------------------------------- */
  const data = useMemo(() => {
    const months = [];
    const now = new Date();

    const totalMonthlyExpenses = expenses.reduce(
      (sum, exp) => sum + Number(exp.amount || 0),
      0
    );

    for (let i = 0; i < 12; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() + i, 1);

      const label = month.toLocaleString("en-US", {
        month: "short",
      });

      // --- Sum predicted paychecks falling within this month ---
      let monthlyIncome = 0;

      incomes.forEach((inc) => {
        if (!inc.predictedDates) return;

        inc.predictedDates.forEach((d) => {
          const pd = new Date(d);

          if (
            pd.getMonth() === month.getMonth() &&
            pd.getFullYear() === month.getFullYear()
          ) {
            // Add gross-per-paycheck or estimated paycheck
            monthlyIncome += estimatePaycheck(inc);
          }
        });
      });

      const net = monthlyIncome - totalMonthlyExpenses;

      months.push({
        name: label,
        income: Math.round(monthlyIncome),
        expenses: Math.round(totalMonthlyExpenses),
        net: Math.round(net),
      });
    }

    return months;
  }, [incomes, expenses]);

  return (
    <div className="bg-white border p-5 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-3 text-[#1e293b]">
        12-Month Cash Flow Projection
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4" stroke="#e2e8f0" />

          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `$${v.toLocaleString()}`}
          />

          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />

          {/* Income Line */}
          <Line
            type="monotone"
            dataKey="income"
            stroke="#16a34a"
            strokeWidth={3}
            dot={false}
          />

          {/* Expense Line */}
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#dc2626"
            strokeWidth={3}
            dot={false}
          />

          {/* Net Line */}
          <Line
            type="monotone"
            dataKey="net"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* -----------------------------------------------------------
   Estimate the amount of each paycheck
   Based on income type + salary/hourly structure
------------------------------------------------------------ */
function estimatePaycheck(income) {
  const { incomeType, salaryAnnual, payFrequency, hourlyRate, hoursPerWeek } =
    income;

  if (incomeType === "SALARY") {
    if (!salaryAnnual) return 0;

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
    const weekly = Number(hourlyRate || 0) * Number(hoursPerWeek || 0);

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
