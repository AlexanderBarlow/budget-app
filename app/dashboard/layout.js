"use client";

import DashboardNav from "@/components/DashboardNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
      <DashboardNav />

      {/* Content area */}
      <main className="pt-36 px-6">{children}</main>
    </div>
  );
}
