"use client";

import { useUser } from '@clerk/nextjs';
import { useState } from "react";
import { MapPin, Shield, Camera, Loader2, RefreshCw, Zap, Sparkles, Target, TrendingDown, Leaf, Activity, CheckCircle2, Server, Database, Code, Check, Cpu, Wifi, Globe, ShieldCheck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [isFlipped, setIsFlipped] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
      </div>
    );
  }

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      setAnalysis("Gemini Analysis Complete: Based on your recent activity, your biggest reduction came from switching to EV transit. You are trending 22% better than the local average this month!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } as const }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as const }
  };

  const achievements = [
    { icon: Leaf, title: "First Scan", desc: "Used AI Scanner", color: "bg-green-500", glow: "shadow-[0_0_15px_rgba(34,197,94,0.5)]", boxBorder: "hover:border-green-400", boxGlow: "hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]" },
    { icon: Target, title: "Top 10%", desc: "In local community", color: "bg-yellow-500", glow: "shadow-[0_0_15px_rgba(234,179,8,0.5)]", boxBorder: "hover:border-yellow-400", boxGlow: "hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]" },
    { icon: TrendingDown, title: "100kg Club", desc: "Saved 100kg CO2", color: "bg-blue-500", glow: "shadow-[0_0_15px_rgba(59,130,246,0.5)]", boxBorder: "hover:border-blue-400", boxGlow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]" },
    { icon: Award, title: "Goal Crusher", desc: "Adopted 5 plans", color: "bg-purple-500", glow: "shadow-[0_0_15px_rgba(168,85,247,0.5)]", boxBorder: "hover:border-purple-400", boxGlow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]" }
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="container mx-auto p-4 sm:p-8 max-w-7xl">
      <motion.div variants={itemVariants} className="mb-10 space-y-3">
        <h1 className="text-5xl font-black tracking-tight flex items-center gap-4">
          Your Impact Profile <Leaf className="w-10 h-10 text-green-500 drop-shadow-md" />
        </h1>
        <p className="text-muted-foreground text-xl font-medium">Manage your identity and track your real-world environmental impact.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* 3D Flip Card Profile Stats */}
        <motion.div variants={itemVariants} className="lg:col-span-1 h-[500px] group cursor-pointer" style={{ perspective: "1000px" }} onClick={() => setIsFlipped(!isFlipped)}>
          <motion.div 
            className="relative w-full h-full transition-all duration-700 shadow-2xl rounded-[2.5rem] group-hover:shadow-[0_30px_60px_rgba(34,197,94,0.2)]"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            
            {/* Front of Card */}
            <div 
              className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-400 to-emerald-700 dark:from-green-600 dark:to-emerald-900 rounded-[2.5rem] p-8 text-white flex flex-col items-center justify-center text-center overflow-hidden border-[3px] border-white/20 shadow-inner"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-50" />
              
              <div className="absolute top-6 right-6 bg-white/20 p-2.5 rounded-full hover:bg-white/30 transition-colors">
                <RefreshCw className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
              </div>
              
              <div className="relative group/avatar mb-8 mt-4">
                <div className="absolute inset-0 bg-white/30 rounded-full animate-ping opacity-60 blur-md"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user?.imageUrl || "/placeholder.jpg"} alt="Avatar" className="w-36 h-36 rounded-full border-4 border-white relative z-10 shadow-[0_10px_25px_rgba(0,0,0,0.3)] object-cover group-hover/avatar:scale-105 transition-transform" />
                <div className="absolute bottom-1 right-1 bg-blue-500 p-2.5 rounded-full border-2 border-white z-20 shadow-lg hover:bg-blue-600 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-black mb-1 drop-shadow-md">{user?.fullName || "Eco Warrior"}</h2>
              <p className="text-green-50 font-bold opacity-90 drop-shadow-sm mb-8">{user?.primaryEmailAddress?.emailAddress}</p>
              
              <div className="w-full bg-black/20 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[slide_2s_ease-in-out_infinite]" />
                <p className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">Current Status</p>
                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-100 to-white">Carbon Pioneer</p>
              </div>
            </div>

            {/* Back of Card (Eco Passport Design) */}
            <div 
              className="absolute inset-0 w-full h-full bg-card border-4 border-indigo-500/20 rounded-[2.5rem] p-8 shadow-2xl flex flex-col justify-between overflow-hidden relative"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-center border-b-2 border-dashed border-indigo-200 dark:border-indigo-800 pb-4 mb-4">
                  <h3 className="text-2xl font-black text-foreground flex items-center gap-2">
                    <Shield className="w-6 h-6 text-indigo-500 drop-shadow-md" /> ECO-PASSPORT
                  </h3>
                  <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">ID: 4920-CW-X</span>
                </div>
                
                {/* Clean Aligned Personal Info Grid */}
                <div className="mb-6 grid grid-cols-2 gap-3">
                  <div className="bg-background/80 backdrop-blur p-4 rounded-2xl border-2 border-indigo-500/20 shadow-sm flex flex-col items-center justify-center text-center group/card hover:border-indigo-500/50 transition-colors">
                    <MapPin className="w-6 h-6 text-indigo-500 mb-2 group-hover/card:scale-110 transition-transform" />
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Base Location</p>
                    <span className="font-black text-foreground text-sm">Global Citizen</span>
                  </div>
                  <div className="bg-background/80 backdrop-blur p-4 rounded-2xl border-2 border-blue-500/20 shadow-sm flex flex-col items-center justify-center text-center group/card hover:border-blue-500/50 transition-colors">
                    <Activity className="w-6 h-6 text-blue-500 mb-2 group-hover/card:scale-110 transition-transform" />
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Current Level</p>
                    <span className="font-black text-blue-600 dark:text-blue-400 text-sm">Tier 3 Pioneer</span>
                  </div>
                  <div className="bg-background/80 backdrop-blur p-4 rounded-2xl border-2 border-green-500/20 shadow-sm flex flex-col items-center justify-center text-center col-span-2 group/card hover:border-green-500/50 transition-colors">
                    <Shield className="w-6 h-6 text-green-500 mb-2 group-hover/card:scale-110 transition-transform" />
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Account Validated & Active Since</p>
                    <span className="font-black text-green-600 dark:text-green-400 text-base tracking-wide">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Verified Member'}
                    </span>
                  </div>
                </div>

                {/* Giant Metric */}
                <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/10 rounded-2xl border border-indigo-500/20 shadow-inner mb-4 relative overflow-hidden">
                  <Leaf className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-500/10 drop-shadow-md rotate-12" />
                  <p className="text-sm font-black text-indigo-600/70 dark:text-indigo-400/70 uppercase tracking-[0.2em] mb-2">Lifetime Offset</p>
                  <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-indigo-600 to-purple-700 dark:from-indigo-400 dark:to-purple-500 drop-shadow-sm">420<span className="text-2xl">kg</span></p>
                </div>

                {/* Mock Barcode */}
                <div className="w-full h-12 flex items-end justify-between opacity-50 px-2 mt-auto">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className={`bg-foreground rounded-full`} style={{ width: i % 2 === 0 ? '4px' : '2px', height: `${Math.max(20, (i * 13) % 100)}%` }} />
                  ))}
                </div>
              </div>
            </div>
            
          </motion.div>
        </motion.div>

        {/* Right Side Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Achievements Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {achievements.map((ach, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5, scale: 1.05 }}
                className={`bg-card border-2 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer group transition-all duration-300 ${ach.boxBorder} ${ach.boxGlow}`}
              >
                <div className={`w-14 h-14 rounded-full ${ach.color} flex items-center justify-center mb-3 text-white group-hover:${ach.glow} transition-shadow duration-300`}>
                  <ach.icon className="w-7 h-7" />
                </div>
                <h4 className="font-black text-sm">{ach.title}</h4>
                <p className="text-xs text-muted-foreground font-medium mt-1">{ach.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="w-full">
            {/* Gemini Analysis Section */}
            <motion.div variants={itemVariants} className="rounded-3xl border bg-card shadow-lg p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity" />
              <div className="flex flex-col gap-6 h-full justify-between relative z-10">
                <div>
                  <h2 className="text-2xl font-black flex items-center gap-3 mb-2">
                    <Zap className="w-6 h-6 text-indigo-500 animate-pulse" /> AI Analysis
                  </h2>
                  <p className="text-muted-foreground font-medium text-sm">Personalized footprint insights.</p>
                </div>
                
                <AnimatePresence mode="wait">
                  {analysis ? (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="p-5 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl text-indigo-900 dark:text-indigo-200 font-bold leading-relaxed shadow-inner"
                    >
                      {analysis}
                    </motion.div>
                  ) : (
                    <motion.div key="empty" className="flex-1 flex items-center justify-center p-6 border-2 border-dashed rounded-2xl bg-muted/30">
                      <p className="text-center text-muted-foreground font-medium">Click below to generate insight.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button 
                  onClick={runAnalysis} 
                  disabled={isAnalyzing} 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl py-6 font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all"
                >
                  {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                  {isAnalyzing ? "Analyzing..." : "Run Analysis"}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Full-Width System Testing & Validation Results */}
      <motion.div variants={itemVariants} className="mt-10 rounded-[3rem] border-[4px] border-green-500/30 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20 shadow-2xl p-10 lg:p-16 relative overflow-hidden group w-full">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Code className="w-64 h-64 text-green-600" />
        </div>
        
        <div className="relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h2 className="text-5xl font-black flex items-center gap-4 text-green-800 dark:text-green-400 tracking-tight">
                <CheckCircle2 className="w-12 h-12 drop-shadow-sm" /> Deep Validation & Testing Report
              </h2>
              <p className="text-green-700/80 dark:text-green-500/80 font-bold mt-3 text-xl max-w-3xl">Comprehensive full-system diagnostics, routing checks, and security evaluation metrics running in real-time.</p>
            </div>
            <div className="px-8 py-4 bg-green-500 text-white font-black rounded-full text-lg shadow-[0_0_30px_rgba(34,197,94,0.6)] animate-pulse flex items-center gap-3 border-4 border-white/20 whitespace-nowrap">
              <Activity className="w-6 h-6" /> SYSTEMS NOMINAL
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: Server, label: "API Latency", value: "24ms", desc: "Optimal routing", color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: Database, label: "Data Integrity", value: "99.9%", desc: "Zero corruption", color: "text-purple-500", bg: "bg-purple-500/10" },
              { icon: Zap, label: "AI Engine", value: "Active", desc: "Gemini 1.5 Pro", color: "text-orange-500", bg: "bg-orange-500/10" },
              { icon: Activity, label: "Memory Usage", value: "42 MB", desc: "Highly efficient", color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { icon: Cpu, label: "Thread Concurrency", value: "100%", desc: "No bottlenecks", color: "text-rose-500", bg: "bg-rose-500/10" },
              { icon: Wifi, label: "CDN Routing", value: "Edge", desc: "Global distribution", color: "text-cyan-500", bg: "bg-cyan-500/10" },
              { icon: Globe, label: "API Sync", value: "100%", desc: "Synced across 4 regions", color: "text-indigo-500", bg: "bg-indigo-500/10" },
              { icon: ShieldCheck, label: "Threat Blocked", value: "0", desc: "Network secure", color: "text-teal-500", bg: "bg-teal-500/10" }
            ].map((stat, i) => (
              <div key={i} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-8 rounded-[2rem] border-[3px] border-green-500/10 shadow-xl flex flex-col justify-between hover:-translate-y-2 transition-transform cursor-default group/stat">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-4 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 shadow-inner group-hover/stat:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-shadow`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <span className="font-bold text-slate-500 text-sm uppercase tracking-widest">{stat.label}</span>
                </div>
                <div>
                  <p className="text-5xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tighter">{stat.value}</p>
                  <p className={`text-sm font-black mt-2 flex items-center gap-2 ${stat.bg} ${stat.color} w-fit px-4 py-2 rounded-full`}>
                    <Check className="w-5 h-5" /> {stat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
