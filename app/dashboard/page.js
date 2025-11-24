"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import KPISection from "@/components/KPISection";
import CashFlowSection from "@/components/CashFlowSection";
import NetWorthSection from "@/components/NetWorth";
import RetirementSection from "@/components/RetirementSection";

import SlidePanel from "@/components/SlidePanel";
import SetupPanel from "@/components/SetupPanel";

export default function Dashboard() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error) {
        console.error("Error getting session:", error);
      }

      const currentSession = data?.session ?? null;
      setSession(currentSession);
      setCheckingSession(false);

      if (!currentSession) {
        router.replace("/auth/sign-in");
      }
    };

    checkSession();

    // Listen for changes (sign in / sign out)
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!mounted) return;

        setSession(newSession);

        if (!newSession) {
          router.replace("/auth/sign-in");
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, [router]);

  // Still checking session
  if (checkingSession) {
    return <div className="p-10 text-center">Loading session…</div>;
  }

  // No session (redirect is already triggered, but don't render dashboard)
  if (!session) {
    return <div className="p-10 text-center">Redirecting…</div>;
  }

  // Has session → show dashboard
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

      {/* Sections */}
      <KPISection />
      <CashFlowSection />
      <NetWorthSection />
      <RetirementSection />

      {/* Slide Panel */}
      <SlidePanel open={showSetup} onClose={() => setShowSetup(false)}>
        <SetupPanel onClose={() => setShowSetup(false)} />
      </SlidePanel>
    </div>
  );
}
