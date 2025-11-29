"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Edit, DollarSign } from "lucide-react";

export default function IncomeOverview({ userId }) {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load income records
  useEffect(() => {
    async function loadIncome() {
      const res = await fetch(`/api/income?userId=${userId}`);
      const data = await res.json();

      setIncomes(data || []);
      setLoading(false);
    }

    loadIncome();
  }, [userId]);

  if (loading) {
    return <p className="text-gray-500">Loading income...</p>;
  }

  if (!incomes.length) {
    return (
      <p className="text-gray-500 text-center">
        No income added yet. Add your first income source!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1e293b] mb-2">
        Your Income Sources
      </h2>

      {incomes.map((income) => (
        <motion.div
          key={income.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-white shadow p-5"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg font-semibold text-[#1e293b]">
                {income.incomeSource || "Income Source"}
              </p>
              <p className="text-sm text-gray-500">
                {income.incomeType === "SALARY" ? "Salary" : "Hourly"}
              </p>
            </div>

            <button className="text-[#3b82f6] hover:underline flex items-center gap-1">
              <Edit size={18} /> Edit
            </button>
          </div>

          {/* PAY FREQUENCY */}
          <div className="mb-3">
            <p className="text-sm text-gray-500">Pay Frequency</p>
            <p className="font-medium">
              {income.payFrequency.replace("_", " ")}
            </p>
          </div>

          {/* Salary Type */}
          {income.incomeType === "SALARY" && (
            <div className="mb-4 space-y-2">
              <IncomeField label="Annual Salary" value={income.salaryAnnual} />

              {income.bonuses && (
                <IncomeField label="Bonus (Annual)" value={income.bonuses} />
              )}

              {income.commission && (
                <IncomeField
                  label="Commission (Monthly)"
                  value={income.commission}
                />
              )}
            </div>
          )}

          {/* Hourly Type */}
          {income.incomeType === "HOURLY" && (
            <div className="mb-4 space-y-2">
              <IncomeField label="Hourly Rate" value={income.hourlyRate} />
              <IncomeField label="Hours per Week" value={income.hoursPerWeek} />

              {/* Overtime */}
              {income.overtimeRate && (
                <>
                  <IncomeField
                    label="Overtime Rate"
                    value={income.overtimeRate}
                  />
                  <IncomeField
                    label="Overtime Hours (Weekly)"
                    value={income.overtimeHours}
                  />
                </>
              )}

              {/* Holidays */}
              {income.holidayRate && (
                <>
                  <IncomeField
                    label="Holiday Rate"
                    value={income.holidayRate}
                  />
                  <IncomeField
                    label="Holiday Hours (Yearly)"
                    value={income.holidayHours}
                  />
                </>
              )}

              {/* Tips */}
              {income.tips && (
                <IncomeField label="Tips (Monthly)" value={income.tips} />
              )}
            </div>
          )}

          {/* Most Recent Pay */}
          <div className="pt-4 border-t mt-4">
            <p className="text-sm text-gray-500 mb-1">Most Recent Pay</p>
            <p className="font-medium">
              {new Date(income.mostRecentPay).toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* Small visual helper component */
function IncomeField({ label, value }) {
  return (
    <div className="flex justify-between">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium text-gray-900">
        ${Number(value).toLocaleString()}
      </p>
    </div>
  );
}
