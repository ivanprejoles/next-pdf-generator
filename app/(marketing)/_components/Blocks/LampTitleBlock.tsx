"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";

export function LampTitleBlock() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 300 }}
        whileInView={{ opacity: 1, y: 100 }}
        transition={{
          delay: 0.2,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Make Pdfs <br /> the right way
      </motion.h1>
    </LampContainer>
  );
}
