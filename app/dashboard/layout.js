"use client";

import DashboardNav from "@/components/DashboardNavbar";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardLayout({ children }) {

 useEffect(() => {
   async function syncUser() {
     const {
       data: { session },
     } = await supabase.auth.getSession();

     if (!session?.user) return;

     await fetch("/api/user/sync", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         id: session.user.id,
         email: session.user.email,
       }),
     });
   }

   syncUser();
 }, []);

  return (
    <div className="min-h-screen">
      <DashboardNav />

      {/* Content area */}
      <main className="pt-36 px-6">{children}</main>
    </div>
  );
}
