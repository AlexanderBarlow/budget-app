"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSignIn = mode === "sign-in";
  const isSignUp = mode === "sign-up";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;

      if (isSignIn) {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      if (isSignUp) {
        result = await supabase.auth.signUp({ email, password });

        if (result.error) throw result.error;

        const supabaseUser = result.data.user;

        if (!supabaseUser) throw new Error("Could not create user");

        await fetch("/api/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: supabaseUser.id, // SUPER IMPORTANT
            email: supabaseUser.email,
          }),
        });
      }


      if (result.error) throw result.error;

      router.replace("/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto bg-white rounded-xl border border-[#e2e8f0] p-8 shadow-lg"
    >
      <h2 className="text-3xl font-bold text-center mb-6 text-[#1e293b]">
        {isSignIn ? "Welcome Back" : "Create Your Account"}
      </h2>

      {error && (
        <p className="text-red-500 text-sm text-center mb-3">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-[#475569] block mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-lg bg-[#f1f5f9] border border-[#dbe3e1] focus:ring-2 focus:ring-[#2dd4bf]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm text-[#475569] block mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded-lg bg-[#f1f5f9] border border-[#dbe3e1] focus:ring-2 focus:ring-[#3b82f6]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#2dd4bf] to-[#3b82f6] hover:opacity-90 transition"
        >
          {loading ? "Please wait..." : isSignIn ? "Sign In" : "Create Account"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-[#475569]">
        {isSignIn ? "Don't have an account?" : "Already have an account?"}
        <a
          href={isSignIn ? "/auth/sign-up" : "/auth/sign-in"}
          className="text-[#2dd4bf] ml-2 underline"
        >
          {isSignIn ? "Sign up" : "Sign in"}
        </a>
      </p>
    </motion.div>
  );
}
