"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Zap, TreePine, Loader2, ArrowRight, Globe, ChevronDown, Check, Target, Flame, Activity, DollarSign, PenTool, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";

interface ActionStep {
  title: string;
  impact: string;
  description: string;
  category: string;
  difficulty: string;
  roi: string;
}

const COUNTRIES = ["India", "United States", "Canada", "United Kingdom", "Australia", "Germany", "Japan"];
const CATEGORIES = ["All", "Energy", "Mobility", "Diet"];

export function AdvisorDashboard() {
  const [mainTab, setMainTab] = useState<'designer' | 'resources'>('designer');

  const [plan, setPlan] = useState<ActionStep[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [robotAnimationData, setRobotAnimationData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch('/robot.json')
      .then(res => res.json())
      .then(data => setRobotAnimationData(data))
      .catch(err => console.error('Error loading robot animation:', err));
  }, []);
  
  const [mapFilter, setMapFilter] = useState<'recycling' | 'ev' | 'ewaste' | 'transit'>('recycling');
  const [country, setCountry] = useState("India");
  const [isMapLoading, setIsMapLoading] = useState(false);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [adoptingIndex, setAdoptingIndex] = useState<number | null>(null);
  const [adoptedIndices, setAdoptedIndices] = useState<number[]>([]);

  const adoptGoal = async (step: ActionStep, index: number) => {
    setAdoptingIndex(index);
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: `${step.title}: ${step.description}`,
          // eslint-disable-next-line react-hooks/purity
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
      });
      if (res.ok) {
        setAdoptedIndices(prev => [...prev, index]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdoptingIndex(null);
    }
  };

  const generatePlan = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPlan([
        // Energy
        { category: "Energy", title: "Smart Thermostat Upgrade", impact: "High", description: "Automate temperature control based on occupancy to slash grid usage.", difficulty: "Medium", roi: "$120/yr" },
        { category: "Energy", title: "Vampire Power Sweep", impact: "Low", description: "Unplug idle electronics using smart power strips.", difficulty: "Easy", roi: "$30/yr" },
        { category: "Energy", title: "Solar Array Installation", impact: "High", description: "Deploy a 5kW solar array to offset 80% of grid dependency.", difficulty: "Hard", roi: "$1,200/yr" },
        { category: "Energy", title: "LED Illumination Transition", impact: "Medium", description: "Replace all incandescent and CFL bulbs with ultra-efficient LEDs.", difficulty: "Easy", roi: "$80/yr" },
        { category: "Energy", title: "Insulation Optimization", impact: "High", description: "Upgrade attic and wall insulation to reduce heating/cooling load.", difficulty: "Hard", roi: "$350/yr" },
        { category: "Energy", title: "Energy-Star Appliances", impact: "Medium", description: "Replace end-of-life appliances with top-tier Energy-Star models.", difficulty: "Medium", roi: "$100/yr" },
        // Diet
        { category: "Diet", title: "Meatless Mondays", impact: "Medium", description: "Eliminate red meat one day a week to lower methane footprint.", difficulty: "Easy", roi: "$50/yr" },
        { category: "Diet", title: "Local Produce Sourcing", impact: "Low", description: "Purchase fruits/vegetables exclusively from local farmer's markets.", difficulty: "Medium", roi: "$0/yr" },
        { category: "Diet", title: "Composting System", impact: "Medium", description: "Convert organic food waste into rich soil instead of sending to landfill.", difficulty: "Medium", roi: "$20/yr" },
        { category: "Diet", title: "Plant-Based Transition", impact: "High", description: "Shift to a 80%+ plant-based diet to slash agricultural footprint.", difficulty: "Hard", roi: "$300/yr" },
        { category: "Diet", title: "Zero-Waste Kitchen", impact: "High", description: "Eliminate single-use plastics and packaging in all grocery runs.", difficulty: "Hard", roi: "$150/yr" },
        // Mobility
        { category: "Mobility", title: "Micro-Mobility Commute", impact: "High", description: "Utilize an e-bike or scooter for commutes under 5 miles.", difficulty: "Hard", roi: "$400/yr" },
        { category: "Mobility", title: "Carpool Syndicate", impact: "Medium", description: "Coordinate weekly carpooling for regular commutes.", difficulty: "Medium", roi: "$150/yr" },
        { category: "Mobility", title: "Public Transit Pivot", impact: "High", description: "Replace 3 car trips a week with bus or train transit.", difficulty: "Medium", roi: "$250/yr" },
        { category: "Mobility", title: "Tire Pressure Optimization", impact: "Low", description: "Maintain optimal tire pressure to boost vehicle fuel efficiency by 3%.", difficulty: "Easy", roi: "$40/yr" },
        { category: "Mobility", title: "EV Transition Prep", impact: "High", description: "Install a Level 2 home charger in preparation for an EV purchase.", difficulty: "Hard", roi: "$0/yr" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMapLoading(true);
    const timer = setTimeout(() => setIsMapLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [country, mapFilter]);

  const generateMockPlaces = (type: string, country: string): { id: string, name: string, address: string, distance: string, status: string }[] => {
    const regionalData: Record<string, Record<string, string[]>> = {
      "India": {
        recycling: ["Saahas Zero Waste", "Namo E-Waste Management", "Synergy Waste Management", "Attero Recycling"],
        ev: ["Tata Power EZ Charge", "Ather Grid Station", "Zeon Charging", "ChargeZone Fast Charger"],
        ewaste: ["E-Parisaraa", "EcoCentric Management", "Cerebra Integrated Tech", "Hulladek Recycling"],
        transit: ["Delhi Metro Station", "Namma Metro Station", "BEST Bus Depot", "Mumbai Local Station"]
      },
      "United States": {
        recycling: ["Waste Management Center", "Republic Services Facility", "EcoCycle Hub", "Recology Sorting Center"],
        ev: ["Tesla Supercharger", "Electrify America", "EVgo Fast Charging", "ChargePoint Network"],
        ewaste: ["BestBuy E-Waste Dropoff", "EcoATM Kiosk", "Call2Recycle Hub", "Staples Tech Recycling"],
        transit: ["Amtrak Union Station", "City Subway Transit", "MTA Bus Terminal", "BART Station"]
      },
      "Canada": {
        recycling: ["GreenForLife Hub", "Cascades Recovery+", "Progressive Waste Center", "Urban Impact"],
        ev: ["Flo Charging Network", "Petro-Canada EV", "ChargePoint Hub", "BC Hydro EV"],
        ewaste: ["Electronic Recycling Assoc.", "Quantum Lifecycle", "Staples E-Waste", "BestBuy Tech Drop"],
        transit: ["TTC Subway Station", "Go Transit Terminal", "TransLink Skytrain", "Via Rail Station"]
      },
      "United Kingdom": {
        recycling: ["Biffa Waste Services", "Veolia Recycling Centre", "Suez Processing", "Viridor Hub"],
        ev: ["Instavolt Station", "BP Pulse Charging", "Gridserve Electric Highway", "Pod Point"],
        ewaste: ["Currys PC World Tech Drop", "WEEE Recycling Hub", "EnviroWaste Center", "TechRecycle Ltd"],
        transit: ["London Underground", "National Rail Station", "Bus Interchange", "Tramlink Station"]
      },
      "Australia": {
        recycling: ["Cleanaway Hub", "Visy Recycling Center", "Bingo Industries", "Suez Environnement"],
        ev: ["Chargefox Network", "Evie Networks", "Tesla Supercharger", "AmpCharge Station"],
        ewaste: ["TechCollect Dropoff", "MobileMuster Kiosk", "E-Waste Recycling Aus", "Officeworks Tech Bin"],
        transit: ["Sydney Trains Station", "Metro Transit Hub", "Busway Terminal", "V/Line Station"]
      },
      "Germany": {
        recycling: ["Remondis Wertstoffhof", "ALBA Group Facility", "Veolia Umweltservice", "Rethmann Recycling"],
        ev: ["EnBW HyperNetz", "Ionity Fast Charger", "Aral pulse", "Allego Station"],
        ewaste: ["Elektroschrott Annahmestelle", "Saturn Tech-Recycling", "MediaMarkt Dropoff", "Zweckverband Abfall"],
        transit: ["U-Bahn Station", "S-Bahn Transit", "Hauptbahnhof", "Busbahnhof"]
      },
      "Japan": {
        recycling: ["Showa Denko Eco Hub", "JFE Engineering Recycle", "Orix Eco Services", "Kamikatsu Zero Waste"],
        ev: ["e-Mobility Power", "Nissan Quick Charge", "CHAdeMO Station", "Tesla Supercharger"],
        ewaste: ["Bic Camera Tech Drop", "Yodobashi E-Waste", "ReNet Japan Group", "Kojima Recycling"],
        transit: ["Shinkansen Station", "Tokyo Metro Hub", "JR East Terminal", "City Bus Stop"]
      }
    };

    const names = regionalData[country] ? regionalData[country][type] : regionalData["United States"][type];

    return names.map((name: string, i: number) => ({
      id: i.toString(),
      name: name,
      address: `${100 + i * 42} Eco ${i % 2 === 0 ? 'Street' : 'Avenue'}, ${country}`,
      distance: `${(i * 1.2 + 0.8).toFixed(1)} mi`,
      status: i % 3 === 0 ? 'Closed soon' : 'Open Now'
    }));
  };

  const progressPercentage = plan && plan.length > 0 ? Math.round((adoptedIndices.length / plan.length) * 100) : 0;

  const filteredPlan = useMemo(() => {
    if (!plan) return null;
    if (activeCategory === "All") return plan;
    return plan.filter(p => p.category === activeCategory);
  }, [plan, activeCategory]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 w-full px-2 sm:px-4 py-8">
      
      {/* Master 2-Section Switch with Robot Lottie */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
        {robotAnimationData && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: -20 }} 
            animate={{ opacity: 1, scale: 1, x: 0 }} 
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 sm:w-32 sm:h-32"
          >
            <Lottie animationData={robotAnimationData} loop={true} className="w-full h-full drop-shadow-[0_0_20px_rgba(99,102,241,0.4)]" aria-hidden="true" />
          </motion.div>
        )}
        <div className="flex p-2 bg-slate-100 dark:bg-slate-900 rounded-[2rem] shadow-inner border-[3px] border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setMainTab('designer')}
            className={`relative flex items-center gap-3 px-10 py-5 rounded-[1.5rem] text-lg font-black transition-all z-10 ${mainTab === 'designer' ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            {mainTab === 'designer' && (
              <motion.div layoutId="maintab-bg" className="absolute inset-0 bg-indigo-600 rounded-[1.5rem] shadow-[0_0_30px_rgba(79,70,229,0.5)] -z-10" />
            )}
            <PenTool className={`w-6 h-6 ${mainTab === 'designer' ? 'animate-pulse' : ''}`} />
            AI Goal Designer
          </button>
          <button
            onClick={() => setMainTab('resources')}
            className={`relative flex items-center gap-3 px-10 py-5 rounded-[1.5rem] text-lg font-black transition-all z-10 ${mainTab === 'resources' ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            {mainTab === 'resources' && (
              <motion.div layoutId="maintab-bg" className="absolute inset-0 bg-green-600 rounded-[1.5rem] shadow-[0_0_30px_rgba(22,163,74,0.5)] -z-10" />
            )}
            <MapPin className={`w-6 h-6 ${mainTab === 'resources' ? 'animate-bounce' : ''}`} />
            Local Eco Resources
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mainTab === 'designer' && (
          <motion.div
            key="designer"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-8"
          >
            {/* Progress Tracker Widget */}
            {plan && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} 
                className="bg-card border-2 border-indigo-500/20 rounded-[2rem] p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center gap-8 justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyan-400 to-indigo-500 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg transform rotate-3">
                    <Target className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl tracking-tight">Mission Progress</h3>
                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mt-1">Adopt actions to boost score</p>
                  </div>
                </div>
                
                <div className="flex-1 w-full max-w-xl space-y-3">
                  <div className="flex justify-between text-base font-black">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-500">{progressPercentage}% Adopted</span>
                    <span className="text-muted-foreground">{adoptedIndices.length} / {plan.length} Plans</span>
                  </div>
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-300 dark:border-slate-700">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1.5, type: "spring" }}
                      className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[slide_1s_linear_infinite]" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI Goal Designer Section */}
            <section className="p-8 lg:p-12 rounded-[3rem] bg-slate-50 dark:bg-slate-900 border-[3px] shadow-2xl relative overflow-hidden min-h-[70vh]">
              {/* Decorative blueprint grid background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
              
              <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div>
                  <h2 className="text-6xl font-black tracking-tighter bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-4">
                    <Sparkles className="w-12 h-12 text-indigo-500" />
                    AI Goal Designer
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-4 font-bold text-xl max-w-2xl">Generate hyper-personalized architectural goals for your eco-lifestyle.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-end">
                  {/* Category Switcher */}
                  {plan && (
                    <div className="flex p-1.5 bg-white dark:bg-slate-800 rounded-xl shadow-inner border-2">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`relative px-6 py-3 rounded-lg text-base font-black transition-all z-10 ${activeCategory === cat ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                          {activeCategory === cat && (
                            <motion.div layoutId="category-filter" className="absolute inset-0 bg-indigo-500 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.5)] -z-10" />
                          )}
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}

                  <Button 
                    onClick={generatePlan} 
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-10 py-8 text-xl font-black shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.8)] transition-all"
                  >
                    {isLoading ? <Loader2 className="w-8 h-8 animate-spin mr-3" /> : <Zap className="w-8 h-8 mr-3" />}
                    {isLoading ? "Designing..." : "Generate Goals"}
                  </Button>
                </div>
              </header>

              <AnimatePresence mode="wait">
                {filteredPlan && filteredPlan.length > 0 ? (
                  <motion.div 
                    key={`plan-${activeCategory}`}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 w-full"
                  >
                    {filteredPlan.map((step, idx) => {
                      const globalIndex = plan!.findIndex(p => p.title === step.title);
                      const isAdopted = adoptedIndices.includes(globalIndex);
                      
                      return (
                        <motion.div 
                          key={step.title} 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1, type: "spring" }}
                          whileHover={!isAdopted ? { scale: 1.01 } : {}}
                          className={`p-6 lg:p-8 rounded-[2rem] border-[3px] relative transition-all duration-500 flex flex-col justify-between gap-8 overflow-hidden w-full ${isAdopted ? 'bg-green-500/10 border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.15)]' : 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-800 shadow-2xl hover:shadow-[0_30px_60px_rgba(99,102,241,0.2)] hover:border-indigo-400'}`}
                        >
                          {/* Blueprint decorative lines */}
                          <div className="absolute top-0 right-12 w-0.5 h-20 bg-gradient-to-b from-indigo-500/50 to-transparent" />
                          <div className="absolute top-12 right-0 h-0.5 w-20 bg-gradient-to-l from-indigo-500/50 to-transparent" />

                          {isAdopted && (
                            <motion.div 
                              initial={{ scale: 3, opacity: 0, rotate: -45 }}
                              animate={{ scale: 1, opacity: 1, rotate: 0 }}
                              transition={{ type: "spring", bounce: 0.6 }}
                              className="absolute -top-4 -right-4 bg-green-500 text-white p-6 rounded-full shadow-[0_0_40px_rgba(34,197,94,0.8)] z-20"
                            >
                              <Check className="w-10 h-10" />
                            </motion.div>
                          )}

                          <div>
                            <div className="flex justify-between items-start mb-6 border-b-2 border-dashed border-slate-200 dark:border-slate-700 pb-4">
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-xl font-black text-indigo-300">#{String(globalIndex + 1).padStart(2, '0')}</span>
                                <span className={`text-xs font-black px-3 py-1.5 rounded-md uppercase tracking-widest border-l-4 ${step.category === 'Energy' ? 'bg-yellow-100 text-yellow-700 border-yellow-500' : step.category === 'Mobility' ? 'bg-blue-100 text-blue-700 border-blue-500' : 'bg-green-100 text-green-700 border-green-500'}`}>
                                  {step.category}
                                </span>
                              </div>
                              <span className={`text-xs font-black px-3 py-1.5 rounded-md uppercase tracking-widest ${step.impact === 'High' ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-200 text-slate-700'}`}>
                                {step.impact} Impact
                              </span>
                            </div>
                            
                            <h3 className="font-black text-2xl mb-4 font-serif leading-tight">{step.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 font-medium text-base leading-relaxed">{step.description}</p>
                          </div>
                          
                          <div>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 flex items-center justify-center gap-3">
                                <Activity className="w-6 h-6 text-indigo-500" />
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-slate-400">Difficulty</p>
                                  <p className="font-black text-base">{step.difficulty}</p>
                                </div>
                              </div>
                              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 flex items-center justify-center gap-3">
                                <DollarSign className="w-6 h-6 text-green-500" />
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-slate-400">Est. ROI</p>
                                  <p className="font-black text-base text-green-600">{step.roi}</p>
                                </div>
                              </div>
                            </div>

                            <Button 
                              className={`w-full justify-center font-black rounded-xl py-6 text-lg transition-all border-2 ${isAdopted ? 'bg-green-500 border-green-400 hover:bg-green-600 text-white shadow-inner pointer-events-none' : 'bg-transparent border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-500 dark:hover:text-white hover:scale-[1.02]'}`}
                              onClick={() => adoptGoal(step, globalIndex)}
                              disabled={adoptingIndex === globalIndex || isAdopted}
                            >
                              {isAdopted ? (
                                <>Deployed <Flame className="w-5 h-5 ml-2 text-yellow-300" /></>
                              ) : adoptingIndex === globalIndex ? (
                                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Init...</>
                              ) : (
                                <>Adopt <ArrowRight className="w-5 h-5 ml-2" /></>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                ) : filteredPlan && filteredPlan.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-64 rounded-3xl border-4 border-dashed flex items-center justify-center bg-white/50 dark:bg-slate-800/50 relative z-10">
                    <p className="font-bold text-2xl text-muted-foreground">No goals found in this category.</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="h-[60vh] min-h-[500px] rounded-[3rem] border-4 border-dashed flex flex-col items-center justify-center text-center p-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm relative z-10"
                  >
                    <div className="w-32 h-32 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-8 shadow-inner border-2 border-indigo-100">
                      <LayoutGrid className="w-16 h-16 text-indigo-400 animate-pulse" />
                    </div>
                    <h3 className="text-5xl font-black mb-4 text-slate-700 dark:text-slate-300">Designer Workspace Empty</h3>
                    <p className="text-slate-500 font-bold text-xl max-w-2xl">
                      Initialize the AI engine above to generate a massive, personalized architectural grid of goals to reduce your carbon footprint.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </motion.div>
        )}

        {mainTab === 'resources' && (
          <motion.div
            key="resources"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Local Resources Map Section */}
            <section className="p-8 lg:p-12 rounded-[3rem] bg-card border-[3px] shadow-2xl relative overflow-hidden flex flex-col">
              <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6 relative z-10">
                <div>
                  <h2 className="text-5xl font-black flex items-center gap-4">
                    <MapPin className="w-12 h-12 text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-bounce" /> Local Eco-Resources
                  </h2>
                  <p className="text-muted-foreground mt-4 font-bold text-xl">Discover live recycling centers, EV charging, and more near you.</p>
                </div>
                
                <div className="flex flex-wrap gap-4 items-center w-full xl:w-auto justify-end">
                  
                  {/* Country Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-3 bg-muted px-6 py-4 rounded-2xl border-[3px] hover:border-green-500/50 transition-all font-bold text-lg w-[240px] justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="w-6 h-6 text-green-600" />
                        {country}
                      </div>
                      <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }}>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute z-50 top-full mt-2 w-full bg-background border-[3px] rounded-2xl shadow-2xl overflow-hidden py-2"
                        >
                          {COUNTRIES.map((c) => (
                            <li key={c}>
                              <button
                                onClick={() => { setCountry(c); setDropdownOpen(false); }}
                                className="w-full text-left px-6 py-4 text-base font-bold hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 transition-colors flex items-center justify-between"
                              >
                                {c}
                                {country === c && <Check className="w-6 h-6 text-green-500" />}
                              </button>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Segmented Control Map Filters */}
                  <div className="flex p-2 bg-muted rounded-[1.5rem] shadow-inner border-[3px]">
                    {[
                      { id: 'recycling', label: 'Recycling' },
                      { id: 'ev', label: 'EV Charging' },
                      { id: 'ewaste', label: 'E-Waste' },
                      { id: 'transit', label: 'Transit' }
                    ].map(filter => (
                      <button
                        key={filter.id}
                        onClick={() => setMapFilter(filter.id as "recycling" | "ev" | "ewaste" | "transit")}
                        className={`relative px-6 py-3 rounded-xl text-base font-black transition-all z-10 ${mapFilter === filter.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        {mapFilter === filter.id && (
                          <motion.div layoutId="map-filter" className="absolute inset-0 bg-background border-2 rounded-xl shadow-md -z-10" />
                        )}
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
              </header>

              <div className="w-full rounded-[2rem] overflow-hidden border-[4px] relative bg-slate-100 dark:bg-slate-900 shadow-inner group p-8">
                {isMapLoading ? (
                  <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                     <Loader2 className="w-16 h-16 text-green-500 animate-spin drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full">
                    {generateMockPlaces(mapFilter, country).map((place, idx) => {
                      const getGlowStyles = () => {
                        switch(mapFilter) {
                          case 'ev': return 'hover:border-blue-400 hover:shadow-[0_0_40px_rgba(59,130,246,0.35)]';
                          case 'ewaste': return 'hover:border-orange-400 hover:shadow-[0_0_40px_rgba(249,115,22,0.35)]';
                          case 'transit': return 'hover:border-purple-400 hover:shadow-[0_0_40px_rgba(168,85,247,0.35)]';
                          default: return 'hover:border-green-400 hover:shadow-[0_0_40px_rgba(34,197,94,0.35)]';
                        }
                      };

                      const getLineColor = () => {
                        switch(mapFilter) {
                          case 'ev': return 'from-blue-500/40';
                          case 'ewaste': return 'from-orange-500/40';
                          case 'transit': return 'from-purple-500/40';
                          default: return 'from-green-500/40';
                        }
                      };

                      return (
                      <motion.div 
                        key={place.name} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1, type: "spring" }}
                        whileHover={{ y: -5, scale: 1.02, filter: "brightness(1.05)" }}
                        className={`bg-white dark:bg-slate-800 p-6 rounded-[1.5rem] border-[3px] border-slate-200 dark:border-slate-700 transition-all duration-300 shadow-xl flex flex-col justify-between overflow-hidden relative ${getGlowStyles()}`}
                      >
                        <div className={`absolute top-0 right-10 w-0.5 h-16 bg-gradient-to-b to-transparent ${getLineColor()}`} />
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${mapFilter === 'ev' ? 'bg-blue-100 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : mapFilter === 'ewaste' ? 'bg-orange-100 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : mapFilter === 'transit' ? 'bg-purple-100 text-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'bg-green-100 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]'}`}>
                              {mapFilter === 'ev' ? <Zap className="w-6 h-6" /> : mapFilter === 'ewaste' ? <Globe className="w-6 h-6" /> : mapFilter === 'transit' ? <MapPin className="w-6 h-6" /> : <TreePine className="w-6 h-6" />}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider shadow-sm ${place.status === 'Open Now' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              {place.status}
                            </span>
                          </div>
                          <h4 className="text-2xl font-black mb-2 leading-tight">{place.name}</h4>
                          <p className="text-slate-500 font-medium text-sm mb-6">{place.address}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-3 text-slate-400 font-bold mb-6 text-lg bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border-2">
                            <MapPin className="w-5 h-5" />
                            {place.distance} Away
                          </div>
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-4 rounded-xl font-black text-lg flex justify-center items-center gap-3 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all"
                          >
                            <Globe className="w-5 h-5" /> Open in Maps
                          </a>
                        </div>
                      </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
