"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Tags } from "lucide-react";
import ExpenseModal from "@/components/ExpenseModal";
import CategoryModal from "@/components/CategoryModal";

export default function ExpensesPage() {
  const [userId, setUserId] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  /* ---------------- Load User ---------------- */
  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) setUserId(session.user.id);
    })();
  }, []);

  /* ---------------- Load Data ---------------- */
  useEffect(() => {
    if (!userId) return;
    loadExpenses();
    loadCategories();
  }, [userId]);

  async function loadExpenses() {
    const res = await fetch(`/api/expenses?userId=${userId}`);
    const data = res.ok ? await res.json() : [];
    setExpenses(data);
  }

  async function loadCategories() {
    const res = await fetch(`/api/categories?userId=${userId}`);
    const data = res.ok ? await res.json() : [];
    setCategories(data);
  }

  /* ---------------- Edit / Delete ---------------- */

  function handleEdit(expense) {
    setEditingExpense(expense);
    setShowExpenseModal(true);
  }

  async function handleDelete(id) {
    const confirmDelete = confirm("Delete this expense?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });

    if (res.ok) {
      loadExpenses();
    } else {
      alert("Failed to delete expense");
    }
  }

  /* ---------------- Group by Category ---------------- */
  const grouped = categories.map((cat) => ({
    ...cat,
    items: expenses.filter((e) => e.categoryId === cat.id),
  }));

  const uncategorized = expenses.filter((e) => !e.categoryId);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-[#1e293b]">Expenses</h1>
        <p className="text-[#475569]">
          Categorize, track, and manage your recurring expenses.
        </p>
      </header>

      {/* CATEGORY STRIP */}
      <section className="bg-white border rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Tags className="text-blue-600" size={18} />
            <h2 className="text-sm font-semibold text-[#0f172a] uppercase tracking-wide">
              Your Categories
            </h2>
          </div>

          <button
            onClick={() => setShowCategoryModal(true)}
            className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
          >
            <Plus size={14} />
            New Category
          </button>
        </div>

        {categories.length === 0 ? (
          <p className="text-xs text-gray-500">
            You don’t have any categories yet. Create one to start grouping your
            spending.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const bg = cat.color || "#e5e7eb";
              return (
                <div
                  key={cat.id}
                  className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border shadow-sm"
                  style={{
                    backgroundColor: bg + "20",
                    borderColor: bg,
                    color: "#0f172a",
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: bg }}
                  />
                  <span>{cat.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* GROUPED EXPENSES */}
      <section className="space-y-6">
        {grouped.map((group) => (
          <div key={group.id} className="space-y-3">
            <h3 className="text-sm font-semibold text-[#1e293b] tracking-wide">
              {group.name}
            </h3>

            {group.items.length === 0 ? (
              <p className="text-xs text-gray-500">
                No expenses in this category.
              </p>
            ) : (
              group.items.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white border p-4 rounded-2xl shadow-sm flex justify-between items-start gap-4"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-[#0f172a]">{exp.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {exp.frequency.toLowerCase()}
                    </p>
                    {exp.nextCharge && (
                      <p className="text-[11px] text-blue-600 mt-1">
                        Next Charge:{" "}
                        {new Date(exp.nextCharge).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold text-[#0f766e]">
                      ${Number(exp.amount).toLocaleString()}
                    </p>

                    <div className="flex gap-3 text-xs">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="px-2 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}

        {/* UNCATEGORIZED */}
        {uncategorized.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#1e293b]">Other</h3>

            {uncategorized.map((exp) => (
              <div
                key={exp.id}
                className="bg-white border p-4 rounded-2xl shadow-sm flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold">{exp.name}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {exp.frequency.toLowerCase()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="font-semibold text-[#0f766e]">
                    ${Number(exp.amount).toLocaleString()}
                  </p>

                  <div className="flex gap-3 text-xs">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="px-2 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODALS */}
      {showExpenseModal && (
        <ExpenseModal
          userId={userId}
          categories={categories}
          existing={editingExpense}
          onSaved={() => {
            loadExpenses();
            setEditingExpense(null);
            setShowExpenseModal(false);
          }}
          onClose={() => {
            setEditingExpense(null);
            setShowExpenseModal(false);
          }}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          userId={userId}
          onCreated={loadCategories}
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </div>
  );
}
