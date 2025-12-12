"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export default function SpendingPieChart({ expenses }) {
  if (!expenses) return null;

  const data = buildCategoryBreakdown(expenses);

  const COLORS = [
    "#3b82f6",
    "#34d399",
    "#f472b6",
    "#facc15",
    "#fb923c",
    "#38bdf8",
    "#a78bfa",
    "#ef4444",
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
          }}
          formatter={(v, name) => [`$${v.toLocaleString()}`, name]}
        />

        <Pie
          data={data}
          dataKey="total"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={85}
          innerRadius={45}
          paddingAngle={4}
          stroke="white"
          strokeWidth={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

/* --------------------------------------------------
   Totals per category
-------------------------------------------------- */
function buildCategoryBreakdown(expenses) {
  const map = {};

  expenses.forEach((exp) => {
    const name = exp.category?.name || "Uncategorized";
    const amount = Number(exp.amount) || 0;

    if (!map[name]) map[name] = 0;
    map[name] += amount;
  });

  return Object.entries(map).map(([name, total]) => ({
    category: name,
    total,
  }));
}
