"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";

export function CommunityLottie() {
  const [animationData, setAnimationData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch('/community.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => void('Error loading community animation:', err));
  }, []);

  if (!animationData) return <div className="w-16 h-16 sm:w-20 sm:h-20" />;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="w-16 h-16 sm:w-24 sm:h-24 drop-shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center justify-center pointer-events-none shrink-0"
    >
      <Lottie animationData={animationData} loop={true} className="w-full h-full" aria-hidden="true" />
    </motion.div>
  );
}
