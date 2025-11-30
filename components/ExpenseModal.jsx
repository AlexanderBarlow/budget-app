"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ExpenseModal({
  userId,
  categories,
  existing,
  onSaved,
  onClose,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [frequency, setFrequency] = useState("MONTHLY");
  const [billingDate, setBillingDate] = useState("");

  /* Prefill in edit mode */
  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setAmount(existing.amount);
      setCategoryId(existing.categoryId || "");
      setFrequency(existing.frequency || "MONTHLY");
      setBillingDate(existing.billingDate?.split("T")[0] || "");
    }
  }, [existing]);

  async function handleSave() {
    const payload = {
      userId,
      name,
      amount: Number(amount),
      categoryId: categoryId || null,
      frequency,
      billingDate: billingDate || null,
    };

    const url = existing ? `/api/expenses/${existing.id}` : "/api/expenses";

    const method = existing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      toast.error("Failed to save expense.");
      return;
    }

    toast.success(existing ? "Updated!" : "Expense added!");
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl space-y-5">
        <h2 className="text-xl font-semibold">
          {existing ? "Edit Expense" : "Add Expense"}
        </h2>

        <Input label="Name" value={name} setValue={setName} />

        <Input
          label="Amount ($)"
          value={amount}
          setValue={setAmount}
          type="number"
        />

        <div>
          <label className="text-sm text-gray-600">Category</label>
          <select
            className="w-full p-3 border rounded-lg mt-1"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Uncategorized</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Frequency</label>
          <select
            className="w-full p-3 border rounded-lg mt-1"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="MONTHLY">Monthly</option>
            <option value="WEEKLY">Weekly</option>
            <option value="BIWEEKLY">Biweekly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="YEARLY">Yearly</option>
            <option value="ONCE">One-Time</option>
          </select>
        </div>

        <Input
          label="Billing Date"
          type="date"
          value={billingDate}
          setValue={setBillingDate}
        />

        <div className="flex gap-3 pt-3">
          <button
            onClick={onClose}
            className="flex-1 p-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex-1 p-2 rounded-xl bg-blue-600 text-white"
          >
            {existing ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, setValue }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        className="w-full p-3 border rounded-lg mt-1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
