"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { predictNextPayDates } from "@/utils/payDatePredictor";

export default function IncomeForm({ userId, onContinue }) {
  const [source, setSource] = useState("Main Job");
  const [type, setType] = useState("SALARY");
  const [payFrequency, setPayFrequency] = useState("BIWEEKLY");

  // Salary
  const [salaryAnnual, setSalaryAnnual] = useState("");

  // Hourly
  const [hourlyRate, setHourlyRate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");

  // Dates
  const [lastPaid, setLastPaid] = useState("");
  const [previousPaid, setPreviousPaid] = useState("");

  // Manual net
  const [manualOverride, setManualOverride] = useState(false);
  const [netOverride, setNetOverride] = useState("");

  /* ---------------- Calculations ---------------- */

  function periodsPerYear(freq) {
    return { WEEKLY: 52, BIWEEKLY: 26, SEMIMONTHLY: 24, MONTHLY: 12 }[freq];
  }

  function calculateGross() {
    if (type === "SALARY" && salaryAnnual) {
      return Number(salaryAnnual) / periodsPerYear(payFrequency);
    }

    if (type === "HOURLY" && hourlyRate && hoursPerWeek) {
      return (
        (Number(hourlyRate) * Number(hoursPerWeek) * 52) /
        periodsPerYear(payFrequency)
      );
    }

    return null;
  }

  /* ---------------- Submit ---------------- */

  async function handleSubmit(e) {
    e.preventDefault();

    if (!lastPaid) {
      toast.error("Last paid date is required.");
      return;
    }

    const grossPerPeriod = calculateGross();
    const netPerPeriod = manualOverride ? Number(netOverride) : grossPerPeriod;

    const predictedDates = predictNextPayDates({
      mostRecentPay: lastPaid,
      previousPayDate: previousPaid,
      payFrequency,
      count: 12,
    });

    const payload = {
      userId,
      source,
      type,
      payFrequency,

      grossPerPeriod,
      netPerPeriod,
      manualOverride,

      lastPaid: new Date(lastPaid),
      nextExpected: predictedDates?.[0] ? new Date(predictedDates[0]) : null,
      predictedDates,
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
    onContinue?.();
  }

  /* ---------------- UI ---------------- */

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#1e293b]">Income</h2>

      <Input label="Income Source" value={source} setValue={setSource} />

      {/* Type Toggle */}
      <div className="flex gap-3">
        {["SALARY", "HOURLY"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`flex-1 py-2 rounded-lg border ${
              type === t
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Salary */}
      {type === "SALARY" && (
        <Input
          label="Annual Salary ($)"
          value={salaryAnnual}
          setValue={setSalaryAnnual}
        />
      )}

      {/* Hourly */}
      {type === "HOURLY" && (
        <>
          <Input
            label="Hourly Rate ($)"
            value={hourlyRate}
            setValue={setHourlyRate}
          />
          <Input
            label="Hours per Week"
            value={hoursPerWeek}
            setValue={setHoursPerWeek}
          />
        </>
      )}

      <Select
        label="Pay Frequency"
        value={payFrequency}
        setValue={setPayFrequency}
        options={["WEEKLY", "BIWEEKLY", "SEMIMONTHLY", "MONTHLY"]}
      />

      <Input
        label="Last Paid Date"
        type="date"
        value={lastPaid}
        setValue={setLastPaid}
      />

      <Input
        label="Previous Paid Date (optional)"
        type="date"
        value={previousPaid}
        setValue={setPreviousPaid}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={manualOverride}
          onChange={(e) => setManualOverride(e.target.checked)}
        />
        Manually override net pay
      </label>

      {manualOverride && (
        <Input
          label="Net Pay Per Period ($)"
          value={netOverride}
          setValue={setNetOverride}
        />
      )}

      <button className="w-full py-3 bg-gradient-to-r from-emerald-400 to-sky-400 text-white rounded-xl font-semibold shadow">
        Save Income
      </button>
    </motion.form>
  );
}

/* ---------- Helpers ---------- */

function Input({ label, value, setValue, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-[#475569]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-3 border rounded-lg"
      />
    </div>
  );
}

function Select({ label, value, setValue, options }) {
  return (
    <div>
      <label className="text-sm text-[#475569]">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-3 border rounded-lg"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
