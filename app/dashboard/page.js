"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState(undefined); // undefined = loading

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;

      const current = data.session;
      setSession(current);

      if (!current) {
        // Redirect only after hydration
        router.replace("/auth/sign-in");
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!active) return;

        setSession(nextSession);

        if (!nextSession) {
          router.replace("/auth/sign-in");
        }
      }
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  // Still loading session; avoid triggering redirects
  if (session === undefined) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // If session is null, the redirect already happened in useEffect
  if (session === null) {
    return <div className="p-10 text-center">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-4xl font-bold">Welcome to Your Dashboard</h1>
    </div>
  );
}
