"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function AuthForm({ mode = "signin" }) {
  const isSignup = mode === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const validate = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value) error = "Email is required.";
      else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
        error = "Please enter a valid email.";
    }
    if (name === "password") {
      if (!value) error = "Password is required.";
      else if (value.length < 6)
        error = "Password must be at least 6 characters.";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (name, value) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(name, value);
  };

  const handleChange = (name, value) => {
    if (touched[name]) validate(name, value);
    if (name === "email") setEmail(value);
    else setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    validate("email", email);
    validate("password", password);

    if (errors.email || errors.password) {
      setLoading(false);
      return;
    }

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
          },
        });
        if (error) throw error;
        setMessage({
          type: "success",
          text: "Check your email to confirm your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ type: "success", text: "Welcome back! Redirecting..." });
        setTimeout(() => (window.location.href = "/dashboard"), 1000);
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-sm mx-auto"
    >
      <Card className="rounded-2xl border border-[#d7e0dc] bg-[#f7f9f8]/80 backdrop-blur-md shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#5bb187] to-[#74c69d] bg-clip-text text-transparent">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-[#5f6b63] mt-2">
            {isSignup
              ? "Sign up to start tracking your budget with ease."
              : "Sign in to manage your finances and goals."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-[#2d3436]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={(e) => handleBlur("email", e.target.value)}
              disabled={loading}
              className={`bg-[#f0f3f2] border ${
                touched.email && errors.email
                  ? "border-[#f5b5b2]"
                  : "border-[#d7e0dc]"
              } focus:ring-2 focus:ring-[#9ae6b4] focus:border-[#74c69d]`}
            />
            {touched.email && errors.email && (
              <p className="text-xs text-[#8c2f29]">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label htmlFor="password" className="text-[#2d3436]">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={(e) => handleBlur("password", e.target.value)}
              disabled={loading}
              className={`bg-[#f0f3f2] border ${
                touched.password && errors.password
                  ? "border-[#f5b5b2]"
                  : "border-[#d7e0dc]"
              } focus:ring-2 focus:ring-[#9ae6b4] focus:border-[#74c69d]`}
            />
            {touched.password && errors.password && (
              <p className="text-xs text-[#8c2f29]">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full font-semibold bg-[#74c69d] hover:bg-[#5bb187] text-white rounded-lg py-2.5 shadow-md transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isSignup ? "Creating..." : "Signing In..."}
              </span>
            ) : isSignup ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-sm flex justify-between items-center pt-2">
          {isSignup ? (
            <Link
              href="/auth/sign-in"
              className="text-[#5f6b63] hover:text-[#2d3436] hover:underline"
            >
              Already have an account?
            </Link>
          ) : (
            <>
              <Link
                href="/auth/reset"
                className="text-[#5f6b63] hover:text-[#2d3436] hover:underline"
              >
                Forgot Password?
              </Link>
              <Link
                href="/auth/sign-up"
                className="text-[#5f6b63] hover:text-[#2d3436] hover:underline"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 flex items-center gap-2 rounded-md border p-3 text-sm ${
                message.type === "success"
                  ? "border-[#b6e0c3] bg-[#e9f7ef] text-[#336b47]"
                  : "border-[#f5b5b2] bg-[#fceceb] text-[#8c2f29]"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-4 h-4 text-[#5bb187]" />
              ) : (
                <XCircle className="w-4 h-4 text-[#8c2f29]" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
