"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// ⬇ NEW IMPORT
import { predictNextPayDates } from "@/utils/payDatePredictor";

const PASSIVE_SOURCES = [
  "Rental Income",
  "Investments / Dividends",
  "Government Benefits",
];

export default function IncomeForm({ userId, onIncomeAdded, onContinue }) {
  const [incomeSource, setIncomeSource] = useState("Main Job");
  const [customSource, setCustomSource] = useState("");
  const [incomeType, setIncomeType] = useState("SALARY");

  // Salary-ish fields
  const [salary, setSalary] = useState("");
  const [bonus, setBonus] = useState("");
  const [commission, setCommission] = useState("");

  // Hourly fields
  const [hourlyRate, setHourlyRate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [overtimeRate, setOvertimeRate] = useState("");
  const [overtimeHours, setOvertimeHours] = useState("");
  const [holidayRate, setHolidayRate] = useState("");
  const [holidayHours, setHolidayHours] = useState("");
  const [tips, setTips] = useState("");

  const [payFrequency, setPayFrequency] = useState("BIWEEKLY");

  // Pay date tracking
  const [mostRecentPay, setMostRecentPay] = useState("");
  const [previousPayDate, setPreviousPayDate] = useState("");

  const isPassiveSource = PASSIVE_SOURCES.includes(incomeSource);
  const showTypeToggle = !isPassiveSource;

  useEffect(() => {
    if (isPassiveSource && incomeType !== "SALARY") {
      setIncomeType("SALARY");
    }
  }, [incomeSource]);

  const effectiveSource =
    incomeSource === "Other" ? customSource || "Other" : incomeSource;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mostRecentPay) {
      toast.error("Please enter the most recent payment date.");
      return;
    }

    const payload = {
      userId,
      incomeSource: effectiveSource,
      incomeType,

      salaryAnnual: incomeType === "SALARY" ? Number(salary) || null : null,
      bonuses: !isPassiveSource ? Number(bonus) || null : null,
      commission: !isPassiveSource ? Number(commission) || null : null,

      hourlyRate:
        !isPassiveSource && incomeType === "HOURLY"
          ? Number(hourlyRate) || null
          : null,
      hoursPerWeek:
        !isPassiveSource && incomeType === "HOURLY"
          ? Number(hoursPerWeek) || null
          : null,

      overtimeRate:
        !isPassiveSource && incomeType === "HOURLY"
          ? Number(overtimeRate) || null
          : null,
      overtimeHours:
        !isPassiveSource && incomeType === "HOURLY"
          ? Number(overtimeHours) || null
          : null,

      holidayRate:
        !isPassiveSource && incomeType === "HOURLY"
          ? Number(holidayRate) || null
          : null,
      holidayHours:
        !isPassiveSource && incomeType === "HOURLY"
          ? Number(holidayHours) || null
          : null,

      tips:
        !isPassiveSource && incomeType === "HOURLY"
          ? Number(tips) || null
          : null,

      payFrequency,

      mostRecentPay: mostRecentPay ? new Date(mostRecentPay) : null,
      previousPayDate: previousPayDate ? new Date(previousPayDate) : null,
    };

    const res = await fetch("/api/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      toast.error("Failed to save income.");
      return;
    }

    toast.success("Income saved!");

    // ⬇⬇ NEW: AUTO-PREDICT FUTURE PAYDATES
    const predicted = predictNextPayDates({
      mostRecentPay,
      previousPayDate,
      payFrequency,
      count: 12,
    });

    // Send predictions to parent
    if (onIncomeAdded) onIncomeAdded(predicted);

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

      {/* INCOME SOURCE */}
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

        {incomeSource === "Other" && (
          <motion.input
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 w-full p-3 rounded-lg border bg-[#f8fafc]"
            placeholder="Describe this income source..."
            value={customSource}
            onChange={(e) => setCustomSource(e.target.value)}
          />
        )}
      </div>

      {/* TYPE TOGGLE */}
      {showTypeToggle && (
        <div className="flex gap-4">
          {["SALARY", "HOURLY"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setIncomeType(t)}
              className={`flex-1 py-3 rounded-lg border ${
                incomeType === t
                  ? "bg-[#2dd4bf] text-white border-[#2dd4bf]"
                  : "bg-[#f1f5f9] text-[#1e293b] border-[#d1d5db]"
              }`}
            >
              {t === "SALARY" ? "Salary" : "Hourly"}
            </button>
          ))}
        </div>
      )}

      {/* SALARY BLOCK */}
      {incomeType === "SALARY" && (
        <div className="p-4 rounded-xl border bg-[#f8fafc] space-y-4">
          <Input
            label={
              isPassiveSource
                ? "Expected Annual Amount ($)"
                : "Annual Salary ($)"
            }
            value={salary}
            setValue={setSalary}
            required
          />

          {!isPassiveSource && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Bonus ($/yr)" value={bonus} setValue={setBonus} />
              <Input
                label="Commission ($/mo)"
                value={commission}
                setValue={setCommission}
              />
            </div>
          )}
        </div>
      )}

      {/* HOURLY BLOCK */}
      {!isPassiveSource && incomeType === "HOURLY" && (
        <div className="p-4 rounded-xl border bg-[#f8fafc] space-y-6">
          <Input
            label="Hourly Rate ($)"
            value={hourlyRate}
            setValue={setHourlyRate}
            required
          />

          <Input
            label="Hours per Week"
            value={hoursPerWeek}
            setValue={setHoursPerWeek}
            required
          />

          <Section title="Overtime">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Overtime Rate ($)"
                value={overtimeRate}
                setValue={setOvertimeRate}
              />
              <Input
                label="Overtime Hours (weekly)"
                value={overtimeHours}
                setValue={setOvertimeHours}
              />
            </div>
          </Section>

          <Section title="Holiday Pay">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Holiday Rate ($)"
                value={holidayRate}
                setValue={setHolidayRate}
              />
              <Input
                label="Holiday Hours (yearly)"
                value={holidayHours}
                setValue={setHolidayHours}
              />
            </div>
          </Section>

          <Input label="Tips ($/mo)" value={tips} setValue={setTips} />
        </div>
      )}

      {/* PAY DATE TRACKING */}
      <div className="bg-[#f0fdfa] border border-emerald-200 p-4 rounded-xl space-y-4">
        <h3 className="font-semibold text-[#0f766e]">
          Pay Date Tracking (for predictions)
        </h3>

        <Input
          label="Most Recent Pay Date"
          type="date"
          value={mostRecentPay}
          setValue={setMostRecentPay}
          required
        />

        <Input
          label="Previous Pay Date (optional)"
          type="date"
          value={previousPayDate}
          setValue={setPreviousPayDate}
        />

        <p className="text-xs text-[#0f766e]">
          Providing two dates allows us to compute your pay cycle accurately.
        </p>
      </div>

      {/* PAY FREQUENCY */}
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

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-gradient-to-r from-[#2dd4bf] to-[#3b82f6] text-white text-lg font-semibold shadow hover:opacity-90 transition"
      >
        Save Income
      </button>
    </motion.form>
  );
}

/* INPUT COMPONENT */
function Input({
  label,
  value,
  setValue,
  required,
  placeholder,
  type = "number",
}) {
  return (
    <div>
      <label className="block text-sm mb-1 text-[#475569]">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-3 rounded-lg border bg-white"
        placeholder={placeholder}
      />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-[#1e293b]">{title}</p>
      {children}
    </div>
  );
}
