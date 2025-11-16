"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [session, setSession] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const linkBase =
    "px-4 py-2 rounded-lg transition font-semibold text-sm md:text-base";

  const navLinks = session
    ? [
        { name: "Home", href: "/" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Profile", href: "/profile" },
      ]
    : [
        { name: "Home", href: "/" },
        { name: "Sign In", href: "/auth/sign-in" },
        { name: "Sign Up", href: "/auth/sign-up" },
      ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 shadow-sm border-b border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-[#2dd4bf] to-[#3b82f6] bg-clip-text text-transparent"
        >
          FlowWise
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`${linkBase} ${
                pathname === link.href
                  ? "text-[#2dd4bf]"
                  : "text-[#475569] hover:text-[#2dd4bf]"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Sign Out Button */}
          {session && (
            <button
              onClick={signOut}
              className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#f43f5e] to-[#fb7185] text-white hover:opacity-90 transition-all"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-[#475569]"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-b border-[#e2e8f0] shadow"
          >
            <div className="flex flex-col px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`${linkBase} ${
                    pathname === link.href
                      ? "text-[#2dd4bf]"
                      : "text-[#475569] hover:text-[#2dd4bf]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {session && (
                <button
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[#f43f5e] to-[#fb7185] text-white hover:opacity-90 transition"
                >
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
