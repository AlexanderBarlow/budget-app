"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function IncomeForm({ userId, onContinue }) {
  const [incomeSource, setIncomeSource] = useState("Main Job");
  const [incomeType, setIncomeType] = useState("SALARY");

  // Salary fields
  const [salary, setSalary] = useState("");
  const [bonus, setBonus] = useState("");
  const [commission, setCommission] = useState("");

  // Hourly fields
  const [hourlyRate, setHourlyRate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");

  // Overtime
  const [overtimeRate, setOvertimeRate] = useState("");
  const [overtimeHours, setOvertimeHours] = useState("");

  // Holidays
  const [holidayRate, setHolidayRate] = useState("");
  const [holidayHours, setHolidayHours] = useState("");

  // Other earnings
  const [tips, setTips] = useState("");

  const [payFrequency, setPayFrequency] = useState("BIWEEKLY");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userId,
      incomeSource,
      incomeType,

      // salary fields
      salaryAnnual: incomeType === "SALARY" ? Number(salary) : null,
      bonuses: bonus ? Number(bonus) : null,
      commission: commission ? Number(commission) : null,

      // hourly fields
      hourlyRate: incomeType === "HOURLY" ? Number(hourlyRate) : null,
      hoursPerWeek: incomeType === "HOURLY" ? Number(hoursPerWeek) : null,
      overtimeRate: incomeType === "HOURLY" ? Number(overtimeRate) : null,
      overtimeHours: incomeType === "HOURLY" ? Number(overtimeHours) : null,
      holidayRate: incomeType === "HOURLY" ? Number(holidayRate) : null,
      holidayHours: incomeType === "HOURLY" ? Number(holidayHours) : null,
      tips: incomeType === "HOURLY" ? Number(tips) : null,

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
      <h2 className="text-2xl font-bold text-[#1e293b]">Income Details</h2>

      {/* Income Source */}
      <div>
        <label className="block text-sm mb-1 text-[#475569]">
          Income Source
        </label>
        <select
          value={incomeSource}
          onChange={(e) => setIncomeSource(e.target.value)}
          className="w-full p-3 rounded-lg border bg-[#f8fafc]"
        >
          <option>Main Job</option>
          <option>Side Job</option>
          <option>Gig Work</option>
          <option>Freelance</option>
          <option>Rental Income</option>
          <option>Investments / Dividends</option>
          <option>Government Benefits</option>
          <option>Other</option>
        </select>
      </div>

      {/* Income Type */}
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

      {/* Salary Section */}
      {incomeType === "SALARY" && (
        <>
          <div>
            <label className="block text-sm mb-1 text-[#475569]">
              Annual Salary ($)
            </label>
            <input
              type="number"
              required
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full p-3 rounded-lg border bg-[#f8fafc]"
              placeholder="e.g. 65000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-[#475569]">
                Expected Bonus ($/yr)
              </label>
              <input
                type="number"
                value={bonus}
                onChange={(e) => setBonus(e.target.value)}
                className="w-full p-3 rounded-lg border bg-[#f8fafc]"
                placeholder="e.g. 2000"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-[#475569]">
                Commission ($/mo)
              </label>
              <input
                type="number"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="w-full p-3 rounded-lg border bg-[#f8fafc]"
                placeholder="e.g. 500"
              />
            </div>
          </div>
        </>
      )}

      {/* Hourly Section */}
      {incomeType === "HOURLY" && (
        <>
          {/* Base hourly */}
          <div>
            <label className="block text-sm mb-1 text-[#475569]">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              required
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full p-3 rounded-lg border bg-[#f8fafc]"
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
              className="w-full p-3 rounded-lg border bg-[#f8fafc]"
              placeholder="e.g. 40"
            />
          </div>

          {/* Overtime */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-[#475569]">
                Overtime Rate ($)
              </label>
              <input
                type="number"
                value={overtimeRate}
                onChange={(e) => setOvertimeRate(e.target.value)}
                className="w-full p-3 rounded-lg border bg-[#f8fafc]"
                placeholder="e.g. 27.75"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-[#475569]">
                Overtime Hours (weekly)
              </label>
              <input
                type="number"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(e.target.value)}
                className="w-full p-3 rounded-lg border bg-[#f8fafc]"
                placeholder="e.g. 5"
              />
            </div>
          </div>

          {/* Holiday */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-[#475569]">
                Holiday Rate ($)
              </label>
              <input
                type="number"
                value={holidayRate}
                onChange={(e) => setHolidayRate(e.target.value)}
                className="w-full p-3 rounded-lg border bg-[#f8fafc]"
                placeholder="e.g. 36.00"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-[#475569]">
                Holiday Hours (per year)
              </label>
              <input
                type="number"
                value={holidayHours}
                onChange={(e) => setHolidayHours(e.target.value)}
                className="w-full p-3 rounded-lg border bg-[#f8fafc]"
                placeholder="e.g. 16"
              />
            </div>
          </div>

          {/* Tips */}
          <div>
            <label className="block text-sm mb-1 text-[#475569]">
              Tips ($/mo)
            </label>
            <input
              type="number"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              className="w-full p-3 rounded-lg border bg-[#f8fafc]"
              placeholder="e.g. 150"
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
          className="w-full p-3 rounded-lg border bg-[#f8fafc]"
        >
          <option value="WEEKLY">Weekly</option>
          <option value="BIWEEKLY">Biweekly</option>
          <option value="SEMIMONTHLY">Semi-Monthly</option>
          <option value="MONTHLY">Monthly</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-gradient-to-r from-[#2dd4bf] to-[#3b82f6] text-white text-lg font-semibold shadow hover:opacity-90 transition"
      >
        Save Income
      </button>
    </motion.form>
  );
}
