"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Trash } from "lucide-react";

export default function ExpenseForm({ onContinue, onBack }) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  // Fast category add
  const addCategory = useCallback(() => {
    if (!newCategory.trim()) return;
    setCategories((prev) => [
      ...prev,
      { name: newCategory.trim(), expenses: [] },
    ]);
    setNewCategory("");
  }, [newCategory]);

  // Fast expense addition (no prompts)
  const addExpense = useCallback((catIndex) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === catIndex
          ? {
              ...cat,
              expenses: [...cat.expenses, { name: "", amount: "" }],
            }
          : cat
      )
    );
  }, []);

  // Editing expense fields
  const updateExpense = useCallback((catIndex, expIndex, field, value) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === catIndex
          ? {
              ...cat,
              expenses: cat.expenses.map((exp, j) =>
                j === expIndex ? { ...exp, [field]: value } : exp
              ),
            }
          : cat
      )
    );
  }, []);

  const deleteCategory = useCallback((index) => {
    setCategories((prev) => prev.filter((_c, i) => i !== index));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-[#1e293b] mb-6">Expenses</h2>

      {/* Add Category */}
      <div className="flex gap-3 mb-6">
        <input
          placeholder="Add a category (e.g. Housing)"
          className="flex-1 border p-2 rounded-lg bg-[#f1f5f9]"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          onClick={addCategory}
          className="px-4 bg-[#2dd4bf] text-white rounded-lg"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-4">
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border bg-white rounded-xl p-4 shadow"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">{cat.name}</h3>
              <button onClick={() => deleteCategory(index)}>
                <Trash className="text-red-400" size={20} />
              </button>
            </div>

            {/* Expenses */}
            {cat.expenses.map((exp, i) => (
              <div key={i} className="flex gap-3 mb-2">
                <input
                  placeholder="Expense name"
                  className="flex-1 p-2 border rounded-lg bg-[#f8fafc]"
                  value={exp.name}
                  onChange={(e) =>
                    updateExpense(index, i, "name", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="$"
                  className="w-24 p-2 border rounded-lg bg-[#f8fafc]"
                  value={exp.amount}
                  onChange={(e) =>
                    updateExpense(index, i, "amount", e.target.value)
                  }
                />
              </div>
            ))}

            <button
              className="text-sm text-[#3b82f6] underline mt-2"
              onClick={() => addExpense(index)}
            >
              + Add Expense
            </button>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-between mt-10">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#cbd5e1] rounded-lg text-[#1e293b]"
        >
          Back
        </button>

        <button
          onClick={onContinue}
          className="px-6 py-2 bg-gradient-to-r from-[#2dd4bf] to-[#3b82f6] text-white rounded-lg"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
