"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash } from "lucide-react";
import toast from "react-hot-toast";

export default function IncomeOverview({ userId, reload }) {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  // Load income records
  const loadIncome = async () => {
    const res = await fetch(`/api/income?userId=${userId}`);
    const data = await res.json();
    setIncomes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadIncome();
  }, [userId, reload]); // <-- reload triggers refresh

  // DELETE Income
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this income source?"
    );
    if (!confirmDelete) return;

    const res = await fetch(`/api/income/${id}`, { method: "DELETE" });

    if (!res.ok) return toast.error("Failed to delete income.");

    toast.success("Income deleted.");
    loadIncome();
  };

  // SAVE Edits
  const handleSaveEdit = async () => {
    const res = await fetch(`/api/income/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (!res.ok) return toast.error("Failed to update.");

    toast.success("Income updated.");
    setEditing(null);
    loadIncome();
  };

  if (loading) return <p className="text-gray-500">Loading income…</p>;

  if (!incomes.length)
    return (
      <p className="text-gray-500 text-center">
        No income added yet. Add your first income source!
      </p>
    );

  return (
    <>
      <div className="space-y-6">
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

              <div className="flex gap-3">
                <button
                  className="text-blue-500 flex items-center gap-1"
                  onClick={() => setEditing(income)}
                >
                  <Edit size={18} />
                </button>

                <button
                  className="text-red-500 flex items-center gap-1"
                  onClick={() => handleDelete(income.id)}
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>

            <IncomeField
              label="Pay Frequency"
              value={income.payFrequency.replace("_", " ")}
            />

            {/* Salary Details */}
            {income.incomeType === "SALARY" && (
              <div className="mt-4 space-y-2">
                <IncomeField
                  label="Annual Salary"
                  value={income.salaryAnnual}
                />
                {income.bonuses && (
                  <IncomeField label="Bonuses" value={income.bonuses} />
                )}
                {income.commission && (
                  <IncomeField label="Commission" value={income.commission} />
                )}
              </div>
            )}

            {/* Hourly Details */}
            {income.incomeType === "HOURLY" && (
              <div className="mt-4 space-y-2">
                <IncomeField label="Hourly Rate" value={income.hourlyRate} />
                <IncomeField
                  label="Hours per Week"
                  value={income.hoursPerWeek}
                />
                {income.overtimeRate && (
                  <>
                    <IncomeField
                      label="Overtime Rate"
                      value={income.overtimeRate}
                    />
                    <IncomeField
                      label="Overtime Hours"
                      value={income.overtimeHours}
                    />
                  </>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 flex items-end justify-center z-50"
        >
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            className="bg-white w-full max-w-lg p-6 rounded-t-3xl shadow-xl space-y-4"
          >
            <h3 className="text-xl font-semibold">Edit Income Source</h3>

            <div>
              <label className="text-sm text-gray-600">Income Source</label>
              <input
                className="w-full p-2 border rounded-lg"
                value={editing.incomeSource}
                onChange={(e) =>
                  setEditing({ ...editing, incomeSource: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Pay Frequency</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={editing.payFrequency}
                onChange={(e) =>
                  setEditing({ ...editing, payFrequency: e.target.value })
                }
              >
                <option value="WEEKLY">Weekly</option>
                <option value="BIWEEKLY">Biweekly</option>
                <option value="SEMIMONTHLY">Semi-Monthly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>

            <div className="flex justify-between gap-4 pt-3">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 py-2 rounded-xl bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEdit}
                className="flex-1 py-2 rounded-xl bg-blue-500 text-white"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

function IncomeField({ label, value }) {
  return (
    <div className="flex justify-between">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium text-gray-900">
        {typeof value === "number"
          ? "$" + Number(value).toLocaleString()
          : value}
      </p>
    </div>
  );
}
