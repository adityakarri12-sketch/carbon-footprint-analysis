"use client";

import { motion } from "framer-motion";
import { Calculator, Target, Zap } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Calculate Your Baseline",
      description: "Use our comprehensive calculator to input your travel, energy, food, and waste data. Establish your baseline footprint accurately.",
      icon: <Calculator className="w-8 h-8 text-white" />,
      color: "bg-blue-500",
      gradient: "from-blue-500/20 to-transparent",
    },
    {
      id: "02",
      title: "Set Intelligent Goals",
      description: "Review personalized AI insights and choose specific, actionable targets to reduce your highest-emission categories week by week.",
      icon: <Target className="w-8 h-8 text-white" />,
      color: "bg-yellow-500",
      gradient: "from-yellow-500/20 to-transparent",
    },
    {
      id: "03",
      title: "Take Action & Reduce",
      description: "Log your progress, scan items for greener alternatives, and watch your carbon footprint shrink over time on your dashboard.",
      icon: <Zap className="w-8 h-8 text-white" />,
      color: "bg-green-500",
      gradient: "from-green-500/20 to-transparent",
    }
  ];

  return (
    <section className="w-full py-24 relative overflow-hidden bg-background">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A simple, scientifically-backed loop to achieve carbon neutrality.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-border rounded-full z-0">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-blue-500 via-yellow-500 to-green-500 origin-left"
            />
          </div>

          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.3 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className={`w-24 h-24 rounded-full ${step.color} flex items-center justify-center shadow-xl mb-8 group-hover:scale-110 transition-transform duration-500 relative`}>
                <div className={`absolute inset-0 rounded-full bg-gradient-to-t ${step.gradient} blur-xl group-hover:blur-2xl transition-all opacity-50`} />
                {step.icon}
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-background border-4 border-card flex items-center justify-center font-bold text-sm shadow-sm text-foreground">
                  {step.id}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
