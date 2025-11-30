"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddAccountModal({ userId, onClose, onAdded }) {
  const [type, setType] = useState("CHECKING");
  const [institution, setInstitution] = useState("");
  const [nickname, setNickname] = useState("");
  const [balance, setBalance] = useState("");
  const [interestRate, setInterestRate] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        type,
        institution,
        nickname,
        balance: Number(balance),
        interestRate: interestRate ? Number(interestRate) : null,
      }),
    });

    if (!res.ok) {
      toast.error("Failed to add account");
      return;
    }

    toast.success("Account added!");
    onAdded();
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/40 flex items-end justify-center z-50"
    >
      <motion.div
        initial={{ y: 400 }}
        animate={{ y: 0 }}
        className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-xl"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Type */}
          <div>
            <label className="text-sm text-gray-600">Account Type</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="CHECKING">Checking</option>
              <option value="SAVINGS">Savings</option>
              <option value="MONEY_MARKET">Money Market</option>
              <option value="INVESTMENT">Investment</option>
            </select>
          </div>

          {/* Institution */}
          <Input
            label="Institution"
            value={institution}
            setValue={setInstitution}
            placeholder="e.g. Chase, Fidelity"
          />

          {/* Nickname */}
          <Input
            label="Nickname"
            value={nickname}
            setValue={setNickname}
            placeholder="e.g. Emergency Fund"
          />

          {/* Balance */}
          <Input
            label="Balance ($)"
            type="number"
            value={balance}
            setValue={setBalance}
            required
          />

          {/* APY */}
          <Input
            label="Interest Rate (APY %)"
            type="number"
            value={interestRate}
            setValue={setInterestRate}
            placeholder="optional"
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-2 rounded-lg bg-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 p-2 rounded-lg bg-blue-600 text-white"
            >
              Add Account
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function Input({
  label,
  value,
  setValue,
  type = "text",
  placeholder,
  required,
}) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        className="w-full p-2 border rounded-lg mt-1"
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}
