"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Plus, PiggyBank, Landmark, Banknote } from "lucide-react";
import AddAccountModal from "@/components/AddAccountForm";

export default function InsightsPage() {
  const [userId, setUserId] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Load user
  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) setUserId(session.user.id);
    }
    loadUser();
  }, []);

  // Load accounts
  useEffect(() => {
    if (!userId) return;

    async function loadAccounts() {
      const res = await fetch(`/api/accounts?userId=${userId}`);
      const data = res.ok ? await res.json() : [];
      setAccounts(data);
      setLoading(false);
    }

    loadAccounts();
  }, [userId]);

  const refreshAccounts = async () => {
    const res = await fetch(`/api/accounts?userId=${userId}`);
    const data = res.ok ? await res.json() : [];
    setAccounts(data);
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading accounts...</p>;
  }

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-[#1e293b] mb-1">
          Financial Accounts
        </h1>
        <p className="text-[#475569]">
          Track your checking, savings, and investment accounts.
        </p>
      </header>

      {/* ACCOUNT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((acc) => (
          <AccountCard key={acc.id} account={acc} />
        ))}

        {/* ADD NEW ACCOUNT */}
        <button
          onClick={() => setShowModal(true)}
          className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition"
        >
          <Plus size={32} className="text-gray-500" />
          <p className="mt-2 text-gray-600">Add Account</p>
        </button>
      </div>

      {showModal && (
        <AddAccountModal
          userId={userId}
          onClose={() => setShowModal(false)}
          onAdded={refreshAccounts}
        />
      )}
    </div>
  );
}

function AccountCard({ account }) {
  const icons = {
    CHECKING: <Landmark size={26} className="text-blue-600" />,
    SAVINGS: <PiggyBank size={26} className="text-green-600" />,
    MONEY_MARKET: <Banknote size={26} className="text-emerald-600" />,
    INVESTMENT: <Banknote size={26} className="text-purple-600" />,
  };

  return (
    <div className="bg-white border rounded-2xl p-5 shadow space-y-2">
      <div className="flex justify-between items-center">
        <div>{icons[account.type] || <Banknote size={26} />}</div>

        <p className="text-xs text-gray-400">{account.institution || "—"}</p>
      </div>

      <h3 className="text-xl font-bold text-[#1e293b]">
        {account.nickname || account.type}
      </h3>

      <p className="text-2xl font-semibold text-gray-800">
        ${Number(account.balance).toLocaleString()}
      </p>

      {account.interestRate && (
        <p className="text-sm text-green-600">
          APY: {Number(account.interestRate)}%
        </p>
      )}
    </div>
  );
}
