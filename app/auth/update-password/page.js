"use client"; // ⬅️ MUST be FIRST

export const dynamic = "force-dynamic"; // ⬅️ SECOND (prevents prerendering)

import { Suspense, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Wrapped component (client-only)
function UpdatePasswordContent() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    // Supabase automatically reads the access token from URL on mount
  }, [searchParams]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: "", text: "" });

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMsg({ type: "success", text: "Password updated! Redirecting…" });
      setTimeout(() => {
        window.location.href = "/auth/sign-in";
      }, 1200);
    } catch (err) {
      setMsg({
        type: "error",
        text: err.message || "Failed to update password",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-[calc(100dvh)] grid place-items-center p-6">
      <Card className="p-6 space-y-6 w-full max-w-sm">
        <div>
          <h1 className="text-2xl font-semibold">Set a new password</h1>
          <p className="text-sm text-muted-foreground">
            Enter a strong password to secure your account.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleUpdate}>
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Updating..." : "Update Password"}
          </Button>
        </form>

        {msg.text && (
          <div
            className={`rounded-md p-3 text-sm ${
              msg.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {msg.text}
          </div>
        )}
      </Card>
    </main>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading…</div>}>
      <UpdatePasswordContent />
    </Suspense>
  );
}
