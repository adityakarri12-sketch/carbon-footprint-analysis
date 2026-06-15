"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

export function ScannerLottie() {
  const [animationData, setAnimationData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch('/face-scanning.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => void('Error loading scanner animation:', err));
  }, []);

  if (!animationData) return <div className="w-16 h-16 sm:w-24 sm:h-24" />;

  return (
    <div className="w-20 h-20 sm:w-28 sm:h-28 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)] shrink-0">
      <Lottie animationData={animationData} loop={true} className="w-full h-full" aria-hidden="true" />
    </div>
  );
}
