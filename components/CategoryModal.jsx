"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function CategoryModal({ userId, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");

  async function createCategory() {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name, color }),
    });

    if (!res.ok) return toast.error("Failed to create category");

    toast.success("Category created!");
    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-xl">
        <h2 className="text-xl font-semibold">New Category</h2>

        <Input label="Name" value={name} setValue={setName} />

        <Input label="Color" type="color" value={color} setValue={setColor} />

        <div className="flex gap-3 pt-3">
          <button
            onClick={onClose}
            className="flex-1 p-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={createCategory}
            className="flex-1 p-2 rounded-xl bg-blue-600 text-white"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, setValue }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        type={type}
        className="w-full p-3 border rounded-lg mt-1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
