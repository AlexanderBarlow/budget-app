"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash } from "lucide-react";
import toast from "react-hot-toast";

export default function IncomeOverview({ userId, reload }) {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  /* ---------------- Load Income ---------------- */
  async function loadIncome() {
    try {
      const res = await fetch(`/api/income?userId=${userId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setIncomes(data || []);
    } catch {
      toast.error("Failed to load income");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) loadIncome();
  }, [userId, reload]);

  /* ---------------- Delete ---------------- */
  async function handleDelete(id) {
    if (!confirm("Delete this income source?")) return;

    const res = await fetch(`/api/income/${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Delete failed");

    toast.success("Income deleted");
    loadIncome();
  }

  /* ---------------- Save Edit ---------------- */
  async function handleSaveEdit() {
    const res = await fetch(`/api/income/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (!res.ok) return toast.error("Update failed");

    toast.success("Income updated");
    setEditing(null);
    loadIncome();
  }

  if (loading) return <p className="text-gray-500">Loading income…</p>;

  if (!incomes.length)
    return (
      <p className="text-gray-500 text-center">
        No income sources yet. Add one to get started.
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
            className="rounded-2xl border bg-white shadow p-6"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-lg font-semibold text-[#1e293b]">
                  {income.source}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {income.type.toLowerCase()} •{" "}
                  {income.payFrequency.replace("_", " ").toLowerCase()}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditing({ ...income })}
                  className="text-blue-600"
                >
                  <Edit size={18} />
                </button>

                <button
                  onClick={() => handleDelete(income.id)}
                  className="text-red-600"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>

            {/* FINANCIALS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <IncomeField
                label="Gross Per Period"
                value={income.grossPerPeriod}
              />
              <IncomeField label="Net Per Period" value={income.netPerPeriod} />
            </div>

            {/* DATES */}
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              {income.lastPaid && (
                <p>
                  Last Paid:{" "}
                  <span className="font-medium">
                    {new Date(income.lastPaid).toLocaleDateString()}
                  </span>
                </p>
              )}

              {income.nextExpected && (
                <p>
                  Next Expected:{" "}
                  <span className="font-medium text-emerald-600">
                    {new Date(income.nextExpected).toLocaleDateString()}
                  </span>
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ---------------- EDIT MODAL ---------------- */}
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
            <h3 className="text-xl font-semibold">Edit Income</h3>

            <Input
              label="Source"
              value={editing.source}
              onChange={(v) => setEditing({ ...editing, source: v })}
            />

            <Select
              label="Type"
              value={editing.type}
              options={["SALARY", "HOURLY"]}
              onChange={(v) => setEditing({ ...editing, type: v })}
            />

            <Select
              label="Pay Frequency"
              value={editing.payFrequency}
              options={["WEEKLY", "BIWEEKLY", "SEMIMONTHLY", "MONTHLY"]}
              onChange={(v) => setEditing({ ...editing, payFrequency: v })}
            />

            <Input
              label="Gross Per Period"
              type="number"
              value={editing.grossPerPeriod ?? ""}
              onChange={(v) =>
                setEditing({ ...editing, grossPerPeriod: Number(v) })
              }
            />

            <Input
              label="Net Per Period"
              type="number"
              value={editing.netPerPeriod ?? ""}
              onChange={(v) =>
                setEditing({ ...editing, netPerPeriod: Number(v) })
              }
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.manualOverride}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    manualOverride: e.target.checked,
                  })
                }
              />
              Manual net override
            </label>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 py-2 rounded-xl bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-2 rounded-xl bg-emerald-500 text-white"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

/* ---------------- Helpers ---------------- */

function IncomeField({ label, value }) {
  return (
    <div className="flex justify-between border rounded-lg px-4 py-2">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">
        {value != null ? `$${Number(value).toLocaleString()}` : "—"}
      </span>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border rounded-lg"
      />
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border rounded-lg"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o.replace("_", " ")}
          </option>
        ))}
      </select>
    </div>
  );
}
