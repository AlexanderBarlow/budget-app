"use client";
import Link from "next/link";

export default function FooterSection() {
    return (
        <footer className="bg-[#1e293b] text-[#e2e8f0] py-16 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-[#2dd4bf]">
                FlowWise — Financial Clarity, Made Simple.
            </h3>
            <p className="max-w-xl mx-auto text-[#94a3b8] mb-6">
                Start your journey to effortless money management and smarter financial goals.
            </p>
            <Link
                href="/auth/sign-up"
                className="bg-gradient-to-r from-[#2dd4bf] to-[#3b82f6] text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:scale-[1.03] transition-all"
            >
                Get Started Now
            </Link>
            <p className="text-xs text-[#64748b] mt-10">
                © {new Date().getFullYear()} FlowWise. All rights reserved.
            </p>
        </footer>
    );
}
