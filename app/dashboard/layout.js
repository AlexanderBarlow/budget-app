"use client";

import { useState } from "react";
import DashboardNav from "@/components/DashboardNavbar";

export default function DashboardLayout({ children }) {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="min-h-screen">
            {/* Floating Navbar */}
            <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="pt-36 px-6">
                {activeTab === "overview" && <>{children}</>}
                {activeTab === "cashflow" && <div>Cash Flow content</div>}
                {activeTab === "expenses" && <div>Expenses content</div>}
                {activeTab === "profile" && <div>Personal data content</div>}
            </main>
        </div>
    );
}
