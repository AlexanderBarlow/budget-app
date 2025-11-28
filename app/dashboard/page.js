"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Lazy load charts (corrected path)
const KPISection = dynamic(() => import("@/components/KPISection"), {
  ssr: false,
});
const CashFlowSection = dynamic(() => import("@/components/CashFlowSection"), {
  ssr: false,
});
const NetWorthSection = dynamic(() => import("@/components/NetWorth.js"), {
  ssr: false,
});
const RetirementSection = dynamic(
  () => import("@/components/RetirementSection"),
  { ssr: false }
);

const SlidePanel = dynamic(() => import("@/components/SlidePanel"), {
  ssr: false,
});
const SetupPanel = dynamic(() => import("@/components/SetupPanel"), {
  ssr: false,
});

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(undefined);
  const [showSetup, setShowSetup] = useState(false);

  console.log("Hit Dashboard");

  useEffect(() => {
    console.log("Hit session check");
    let mounted = true;

    async function load() {
      const { data } = await supabase.auth.getUser();
      console.log("Supabase returned user:", data);

      if (!mounted) return;

      if (!data?.user) {
        console.log("No user → redirect");
        router.replace("/auth/sign-in");
        return;
      }

      setUser(data.user);
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!mounted) return;

      if (!session?.user) {
        router.replace("/auth/sign-in");
      } else {
        setUser(session.user);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  if (user === undefined) {
    return <div className="p-10 text-center text-xl">Loading dashboard…</div>;
  }

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

      {/* Lazy loaded sections */}
      <KPISection />
      <CashFlowSection />
      <NetWorthSection />
      <RetirementSection />

      <SlidePanel open={showSetup} onClose={() => setShowSetup(false)}>
        <SetupPanel onClose={() => setShowSetup(false)} />
      </SlidePanel>
    </div>
  );
}
