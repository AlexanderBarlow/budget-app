"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

// Lazy-load heavy components (prevent Vercel memory crash)
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

import dynamic from "next/dynamic";
import SlidePanel from "@/components/SlidePanel";
import SetupPanel from "@/components/SetupPanel";

export default function Dashboard() {
  const router = useRouter();

  // undefined = unknown (loading)
  // null = not logged in
  // object = logged in
  const [session, setSession] = useState(undefined);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      const s = data.session;
      setSession(s);

      // redirect AFTER React hydrates
      if (s === null) router.replace("/auth/sign-in");
    }

    load();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!mounted) return;

        setSession(newSession);

        if (!newSession) router.replace("/auth/sign-in");
      }
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [router]);

  // --------------------------
  // UI STATES
  // --------------------------

  if (session === undefined) {
    return (
      <div className="p-10 text-center text-lg text-[#475569]">
        Loading session…
      </div>
    );
  }

  if (session === null) {
    return (
      <div className="p-10 text-center text-lg text-[#475569]">
        Redirecting…
      </div>
    );
  }

  // --------------------------
  // LOGGED IN
  // --------------------------

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <header className="flex items-center justify-between p-10 pb-0">
        <div>
          <h1 className="text-4xl font-bold text-[#1e293b]">Welcome back 👋</h1>
          <p className="text-[#475569] mt-2">
            Here is your financial overview.
          </p>
        </div>

        <button
          onClick={() => setShowSetup(true)}
          className="px-4 py-2 rounded-lg bg-[#2dd4bf] text-white hover:bg-[#28b4a6] transition shadow"
        >
          Edit Financial Info
        </button>
      </header>

      {/* Dashboard Sections */}
      <KPISection />
      <CashFlowSection />
      <NetWorthSection />
      <RetirementSection />

      {/* Slide-in Panel */}
      <SlidePanel open={showSetup} onClose={() => setShowSetup(false)}>
        <SetupPanel onClose={() => setShowSetup(false)} />
      </SlidePanel>
    </div>
  );
}
