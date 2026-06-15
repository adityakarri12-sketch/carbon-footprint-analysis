"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ActivitySquare } from "lucide-react";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  userId: string | null;
}

export function HeroSection({ userId }: HeroSectionProps) {
  const [animationData, setAnimationData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch('/gc-atom.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => void('Error loading Lottie animation:', err));
  }, []);

  return (
    <section className="w-full min-h-[90vh] flex flex-col items-center justify-center px-4 relative">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400 mb-8"
      >
        <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
        Your Intelligent Carbon Tracking Assistant
      </motion.div>

      {/* GC Atom Lottie Animation */}
      {animationData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-48 h-48 sm:w-64 sm:h-64 mb-2 relative z-10"
        >
          <Lottie animationData={animationData} loop={true} className="w-full h-full drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]" aria-hidden="true" />
        </motion.div>
      )}

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-center mb-6 leading-tight flex flex-wrap items-center justify-center gap-3 whitespace-nowrap"
      >
        Welcome to 
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 drop-shadow-sm">
          CarbonWise
        </span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-6 text-xl sm:text-2xl text-muted-foreground max-w-3xl text-center leading-relaxed"
      >
        Take control of your environmental impact. Calculate your footprint, set intelligent goals, and reduce emissions with personalized AI insights.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 w-full max-w-md sm:max-w-none"
      >
        <Button asChild size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-[0_0_30px_rgba(22,163,74,0.3)] hover:shadow-[0_0_50px_rgba(22,163,74,0.5)] transition-all duration-300 hover:-translate-y-1 text-lg px-8 h-16 rounded-2xl group">
          <Link href="/dashboard">
            <ActivitySquare className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            Take me to Dashboard
          </Link>
        </Button>
        {!userId ? (
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-16 px-8 text-lg rounded-2xl border-2 hover:-translate-y-1 transition-all duration-300 group">
            <Link href="/sign-up">
              Create Free Account
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        ) : (
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-16 px-8 text-lg rounded-2xl border-2 hover:-translate-y-1 transition-all duration-300 group">
            <Link href="/visualizations">
              View Visualizations
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        )}
      </motion.div>
    </section>
  );
}
