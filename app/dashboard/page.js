"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";

// Lazy load charts for speed
const KPISection = dynamic(() => import("@/components/KPISection"), {
  ssr: false,
});
const CashFlowSection = dynamic(() => import("@/components/CashFlowSection"), {
  ssr: false,
});
const NetWorthSection = dynamic(() => import("@/components/NetWorth"), {
  ssr: false,
});
const RetirementSection = dynamic(
  () => import("@/components/RetirementSection"),
  { ssr: false }
);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(undefined); // undefined = loading
  const [ready, setReady] = useState(false);

  // -------------------------------
  // LOAD USER SESSION
  // -------------------------------
  useEffect(() => {
    let active = true;

    // initial auth check
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;

      setUser(data.user);

      // if no user, redirect immediately
      if (!data.user) router.replace("/auth/sign-in");
    });

    // listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return;

        setUser(session?.user ?? null);

        if (!session?.user) router.replace("/auth/sign-in");
      }
    );

    // slight delay for smooth chart loading
    setTimeout(() => setReady(true), 150);

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  // -------------------------------
  // LOADING STATES
  // -------------------------------
  if (user === undefined) {
    return <div className="p-10 text-center text-lg">Loading dashboard…</div>;
  }

  if (!user) {
    return <div className="p-10 text-center text-lg">Redirecting…</div>;
  }

  // -------------------------------
  // DASHBOARD UI
  // -------------------------------
  return (
    <div className="min-h-screen bg-[#f8fafc] p-10 space-y-12">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#1e293b]">Welcome back 👋</h1>
          <p className="text-[#475569] mt-1">
            Here is your financial overview.
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/setup")}
          className="px-5 py-2 bg-[#2dd4bf] hover:bg-[#28b4a6] text-white rounded-lg shadow transition"
        >
          Edit Finances
        </button>
      </header>

      {/* Lazy-loaded widgets */}
      <Suspense fallback={<div>Loading KPIs…</div>}>
        {ready && <KPISection />}
      </Suspense>

      <Suspense fallback={<div>Loading Cash Flow…</div>}>
        {ready && <CashFlowSection />}
      </Suspense>

      <Suspense fallback={<div>Loading Net Worth…</div>}>
        {ready && <NetWorthSection />}
      </Suspense>

      <Suspense fallback={<div>Loading Retirement…</div>}>
        {ready && <RetirementSection />}
      </Suspense>
    </div>
  );
}
