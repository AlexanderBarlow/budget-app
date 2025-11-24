"use client";

import { motion } from "framer-motion";

export default function SlidePanel({ open, onClose, children }) {
  return (
    <>
      {/* Dark overlay */}
      {open && (
        <motion.div
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Slide-in panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: open ? "0%" : "100%" }}
        transition={{ type: "tween", duration: 0.35 }}
        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-50 shadow-2xl overflow-y-auto"
      >
        {children}
      </motion.div>
    </>
  );
}
