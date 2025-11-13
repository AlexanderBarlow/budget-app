"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function UpdatePasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] text-[#1e293b]">
            <h1 className="text-2xl font-bold mb-2">Update Your Password</h1>
            <p className="text-sm text-[#475569] mb-8">
                Enter your new password below. This link is associated with token:
            </p>
            <div className="text-xs text-[#64748b] mb-4 bg-[#e2e8f0]/50 rounded-lg px-3 py-2">
                {token || "No token found"}
            </div>
            {/* Add your password reset form here */}
        </div>
    );
}

export default function UpdatePasswordPage() {
    return (
        <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
            <UpdatePasswordContent />
        </Suspense>
    );
}
