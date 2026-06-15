"use client";

import { Target, Leaf, TrendingDown, Globe2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function ProblemAlignment() {
  const pillars = [
    {
      title: "1. Understand",
      description: "You cannot manage what you don't measure. We provide an accurate, high-fidelity carbon footprint calculator that breaks down your impact across transport, energy, diet, and waste.",
      icon: <Target className="w-8 h-8 text-blue-500" />,
      color: "from-blue-500/20 to-blue-500/5",
      borderColor: "border-blue-500/30",
      delay: 0.2,
    },
    {
      title: "2. Track",
      description: "Information without action is useless. CarbonWise allows you to set achievable, timeline-driven emission reduction goals and visually monitor your week-over-week progress.",
      icon: <TrendingDown className="w-8 h-8 text-yellow-500" />,
      color: "from-yellow-500/20 to-yellow-500/5",
      borderColor: "border-yellow-500/30",
      delay: 0.4,
    },
    {
      title: "3. Reduce",
      description: "The ultimate goal. Implement simple, high-impact actions through personalized AI insights and smart object scanning to systematically lower your real-world emissions.",
      icon: <Leaf className="w-8 h-8 text-green-500" />,
      color: "from-green-500/20 to-green-500/5",
      borderColor: "border-green-500/30",
      delay: 0.6,
    }
  ];

  return (
    <section className="w-full py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Core Problem Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-sm font-semibold mb-6 border border-red-500/20">
            <AlertTriangle className="w-4 h-4" /> The Global Challenge
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
            Climate Change is an <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">Information Problem</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Every day, millions of tons of CO₂ are emitted simply because individuals lack immediate, actionable visibility into how their daily choices impact the environment. Without understanding our baseline, meaningful reduction is impossible.
          </p>
        </motion.div>

        {/* The Solution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full rounded-3xl border border-emerald-500/30 bg-card/80 backdrop-blur-xl p-8 md:p-12 shadow-[0_0_40px_rgba(16,185,129,0.15)] group transition-all"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
            <div className="p-4 bg-emerald-500/10 rounded-2xl">
              <Globe2 className="w-12 h-12 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-400">
                The CarbonWise Solution
              </h3>
              <p className="text-lg text-muted-foreground mt-2">
                We bridge the gap between awareness and action through a simple three-step methodology.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <motion.div 
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: pillar.delay }}
                className={`p-8 rounded-2xl border bg-gradient-to-br ${pillar.color} ${pillar.borderColor} hover:-translate-y-2 transition-transform duration-500 shadow-lg`}
              >
                <div className="flex flex-col items-start gap-4 mb-4">
                  <div className="p-4 bg-background rounded-xl shadow-sm">
                    {pillar.icon}
                  </div>
                  <h4 className="font-extrabold text-2xl">{pillar.title}</h4>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
