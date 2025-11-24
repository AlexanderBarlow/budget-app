"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

import KPISection from "@/components/KPISection";
import CashFlowSection from "@/components/CashFlowSection";
import NetWorthSection from "@/components/NetWorthSection";
import RetirementSection from "@/components/RetirementSection";

import SlidePanel from "@/components/SlidePanel";
import SetupPanel from "@/components/SetupPanel";

export default function Dashboard() {
  const router = useRouter();

  // session === undefined → loading
  // session === null → no session
  // session === object → authenticated
  const [session, setSession] = useState(undefined);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    let alive = true;

    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;

      setSession(data.session);
    };

    getSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!alive) return;
        setSession(newSession);
      }
    );

    return () => {
      alive = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  // ----------------------------
  // Handle states safely
  // ----------------------------

  if (session === undefined) {
    return <div className="p-10 text-center text-xl">Loading session…</div>;
  }

  if (session === null) {
    // No session — redirect AFTER render
    router.replace("/auth/sign-in");
    return <div className="p-10 text-center text-xl">Redirecting…</div>;
  }

  // ----------------------------
  // Authenticated Dashboard
  // ----------------------------
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
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

      {/* Sections */}
      <KPISection />
      <CashFlowSection />
      <NetWorthSection />
      <RetirementSection />

      {/* SLIDE-IN PANEL */}
      <SlidePanel open={showSetup} onClose={() => setShowSetup(false)}>
        <SetupPanel onClose={() => setShowSetup(false)} />
      </SlidePanel>
    </div>
  );
}
