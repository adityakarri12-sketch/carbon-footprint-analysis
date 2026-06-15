"use client";

import { motion } from "framer-motion";
import { Bot, Camera, PieChart, ShieldCheck } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "AI Advisor",
      description: "Get personalized, deeply researched sustainability advice tailored to your exact lifestyle and footprint data. Our AI guides you step-by-step.",
      icon: <Bot className="w-10 h-10 text-blue-500" />,
      color: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Vision Scanner",
      description: "Snap a picture of any everyday item. Our advanced Vision AI will analyze its carbon cost and immediately suggest greener, sustainable alternatives.",
      icon: <Camera className="w-10 h-10 text-purple-500" />,
      color: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: "Interactive Visualizations",
      description: "Stop guessing. See your emissions breakdown in beautiful, interactive charts that help you identify your highest impact areas instantly.",
      icon: <PieChart className="w-10 h-10 text-orange-500" />,
      color: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      title: "Data Privacy",
      description: "Your tracking data is yours. We use secure, encrypted data stores and transparent privacy policies so you can track your footprint safely.",
      icon: <ShieldCheck className="w-10 h-10 text-emerald-500" />,
      color: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    }
  ];

  return (
    <section className="w-full py-24 bg-card/50 relative">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to systematically drive your emissions down to zero, powered by cutting-edge technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-8 rounded-3xl border ${feature.borderColor} bg-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group`}
            >
              <div className={`w-20 h-20 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
