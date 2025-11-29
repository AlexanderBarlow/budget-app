"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function IncomeForm({ userId, onContinue }) {
  const [incomeType, setIncomeType] = useState("SALARY");
  const [salary, setSalary] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [payFrequency, setPayFrequency] = useState("BIWEEKLY");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userId,
      incomeType,
      salaryAnnual: incomeType === "SALARY" ? Number(salary) : null,
      hourlyRate: incomeType === "HOURLY" ? Number(hourlyRate) : null,
      hoursPerWeek: incomeType === "HOURLY" ? Number(hoursPerWeek) : null,
      payFrequency,
    };

    const res = await fetch("/api/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      toast.error("Failed to save income. Try again.");
      return;
    }

    toast.success("Income saved successfully! 🎉");

    if (onContinue) onContinue(payload);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#1e293b]">Income</h2>

      {/* Income Type Buttons */}
      <div className="flex gap-4">
        {["SALARY", "HOURLY"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setIncomeType(type)}
            className={`flex-1 py-3 rounded-lg border  
              ${
                incomeType === type
                  ? "bg-[#2dd4bf] text-white border-[#2dd4bf]"
                  : "bg-[#f1f5f9] text-[#1e293b] border-[#d1d5db]"
              }`}
          >
            {type === "SALARY" ? "Salary" : "Hourly"}
          </button>
        ))}
      </div>

      {/* Salary Input */}
      {incomeType === "SALARY" && (
        <div>
          <label className="block text-sm mb-1 text-[#475569]">
            Annual Salary ($)
          </label>
          <input
            type="number"
            required
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full p-3 rounded-lg border bg-[#f8fafc] border-[#d1d5db]"
            placeholder="e.g. 65000"
          />
        </div>
      )}

      {/* Hourly Input */}
      {incomeType === "HOURLY" && (
        <>
          <div>
            <label className="block text-sm mb-1 text-[#475569]">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              required
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full p-3 rounded-lg border bg-[#f8fafc] border-[#d1d5db]"
              placeholder="e.g. 18.50"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-[#475569]">
              Hours per Week
            </label>
            <input
              type="number"
              required
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              className="w-full p-3 rounded-lg border bg-[#f8fafc] border-[#d1d5db]"
              placeholder="e.g. 40"
            />
          </div>
        </>
      )}

      {/* Pay Frequency */}
      <div>
        <label className="block text-sm mb-1 text-[#475569]">
          Pay Frequency
        </label>
        <select
          value={payFrequency}
          onChange={(e) => setPayFrequency(e.target.value)}
          className="w-full p-3 rounded-lg border bg-[#f8fafc] border-[#d1d5db]"
        >
          <option value="WEEKLY">Weekly</option>
          <option value="BIWEEKLY">Biweekly</option>
          <option value="SEMIMONTHLY">Semi-Monthly</option>
          <option value="MONTHLY">Monthly</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-gradient-to-r from-[#2dd4bf] to-[#3b82f6] text-white text-lg font-semibold shadow hover:opacity-90 transition"
      >
        Save Income
      </button>
    </motion.form>
  );
}
