"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export const metadata = { title: "Reset Password" };

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const handleReset = async (e) => {
        e.preventDefault();
        setBusy(true);
        setMsg({ type: "", text: "" });
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
            });
            if (error) throw error;
            setMsg({
                type: "success",
                text: "If that email exists, a reset link has been sent.",
            });
        } catch (err) {
            setMsg({ type: "error", text: err.message || "Error sending reset email" });
        } finally {
            setBusy(false);
        }
    };

    return (
        <main className="min-h-[calc(100dvh)] grid place-items-center p-6">
            <Card className="p-6 space-y-6 w-full max-w-sm">
                <div>
                    <h1 className="text-2xl font-semibold">Reset your password</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email and we’ll send you a reset link.
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleReset}>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={busy}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={busy}>
                        {busy ? "Sending..." : "Send reset link"}
                    </Button>
                </form>

                <div className="text-sm">
                    <Link href="/auth/sign-in" className="text-primary hover:underline">
                        Back to sign in
                    </Link>
                </div>

                {msg.text ? (
                    <div
                        className={`rounded-md p-3 text-sm ${msg.type === "success"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                    >
                        {msg.text}
                    </div>
                ) : null}
            </Card>
        </main>
    );
}
