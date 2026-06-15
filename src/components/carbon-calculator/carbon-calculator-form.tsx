'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { CarbonFootprintResult } from '@/domain/carbon-footprint/carbon-footprint.interface';
import { Car, Zap, Utensils, Trash2, Calculator, CheckCircle2, AlertCircle, RefreshCw, MapPin, Sparkles, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
  transportation: z.coerce.number().min(0, "Must be a positive number"),
  electricity: z.coerce.number().min(0, "Must be a positive number"),
  food: z.coerce.number().min(0, "Must be a positive number"),
  waste: z.coerce.number().min(0, "Must be a positive number"),
});

export function CarbonCalculatorForm() {
  const [result, setResult] = useState<CarbonFootprintResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSmartRoute, setIsSmartRoute] = useState(false);
  const [geminiAdvice, setGeminiAdvice] = useState<string | null>(null);
  const [isGettingAdvice, setIsGettingAdvice] = useState(false);
  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transportation: 0,
      electricity: 0,
      food: 0,
      waste: 0,
    },
  });

  async function fetchGeminiAdvice(resData: CarbonFootprintResult) {
    setIsGettingAdvice(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthly: resData.monthly,
          annual: resData.annual,
          transportation: resData.categoryBreakdown.transportation,
          electricity: resData.categoryBreakdown.electricity,
          food: resData.categoryBreakdown.food,
          waste: resData.categoryBreakdown.waste,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setGeminiAdvice(data.advice);
      }
    } catch (e) {
      void(e);
      setGeminiAdvice("Excellent work calculating your footprint. Every small step helps the planet!");
    } finally {
      setIsGettingAdvice(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setResult(null);
    setGeminiAdvice(null);
    setIsSubmitting(true);
    
    try {
      // If Smart Route is active, fetch real Google Maps distance
      if (isSmartRoute) {
        if (!originCity || !destinationCity) {
          throw new Error("Please enter both Origin and Destination cities for the Smart Route.");
        }
        
        const distRes = await fetch(`/api/maps/distance?origin=${encodeURIComponent(originCity)}&destination=${encodeURIComponent(destinationCity)}`);
        const distData = await distRes.json();
        
        if (!distRes.ok) {
          throw new Error(distData.error || "Failed to calculate distance using Maps API.");
        }
        
        // Multiply by 30 to get a monthly estimate assuming a round trip every day, or just multiply by e.g. 20 working days.
        // The user wants accurate driving distance. Let's assume this is their daily commute (round trip x 20 days)
        // or just take the raw distance if they enter their total monthly driving.
        // We will assume the input is for a typical one-way trip they take often, and multiply by 40 (round trip * 20 days).
        const oneWayDistance = distData.distance;
        values.transportation = Math.round(oneWayDistance * 40); 
      }

      const response = await fetch('/api/footprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate footprint');
      }

      const data = await response.json();
      setResult(data);
      // Kick off Gemini API in background
      fetchGeminiAdvice(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    form.reset();
    setResult(null);
    setError(null);
    setGeminiAdvice(null);
    setIsSmartRoute(false);
    setOriginCity("");
    setDestinationCity("");
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } as const }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as const }
  };

  return (
    <div className="relative h-full flex flex-col">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex-1 flex flex-col">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 flex flex-col">
                
                {/* Advanced Google Maps Mock / Toggle */}
                <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-semibold">Google Maps Smart Route</p>
                      <p className="text-xs text-muted-foreground">Auto-calculate distance from cities</p>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant={isSmartRoute ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setIsSmartRoute(!isSmartRoute)}
                    className={isSmartRoute ? "bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.4)]" : ""}
                  >
                    {isSmartRoute ? "Enabled" : "Enable"}
                  </Button>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                  
                  {isSmartRoute ? (
                    <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-10"><MapPin className="w-16 h-16 text-blue-500" /></div>
                      <div className="col-span-2 sm:col-span-1 z-10">
                        <FormLabel htmlFor="originCity" className="text-xs font-bold text-blue-600 dark:text-blue-400">Origin City</FormLabel>
                        <Input 
                          id="originCity"
                          placeholder="e.g. New York, NY" 
                          className="mt-1 border-blue-500/20 bg-background/50 backdrop-blur" 
                          value={originCity}
                          onChange={(e) => setOriginCity(e.target.value)}
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1 z-10">
                        <FormLabel htmlFor="destinationCity" className="text-xs font-bold text-blue-600 dark:text-blue-400">Destination</FormLabel>
                        <Input 
                          id="destinationCity"
                          placeholder="e.g. Boston, MA" 
                          className="mt-1 border-blue-500/20 bg-background/50 backdrop-blur" 
                          value={destinationCity}
                          onChange={(e) => setDestinationCity(e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                          <Sparkles className="w-3 h-3 inline mr-1 text-blue-500" />
                          Monthly distance calculated using real Google Maps route.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="transportation"
                        render={({ field }) => (
                          <FormItem className="group">
                            <FormLabel className="flex items-center gap-2 group-focus-within:text-green-600 transition-colors relative text-base font-semibold">
                              <Car className="w-5 h-5" /> Transportation
                              <div className="relative group/info ml-1 inline-flex items-center">
                                <Info className="w-4 h-4 text-muted-foreground group-hover/info:text-green-500 transition-colors cursor-help" />
                                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-card border shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 text-xs font-normal text-muted-foreground pointer-events-none opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible">
                                  <span className="font-bold text-green-500 block mb-1">Eco-Tip: Transportation</span>
                                  Passenger cars account for over 40% of transport emissions. Carpooling or taking public transit can slice this number in half instantly!
                                </div>
                              </div>
                            </FormLabel>
                            <FormControl>
                              <div className="relative group/input">
                                <Input type="number" aria-describedby="transport-desc" className="h-14 text-lg pl-4 pr-12 focus-visible:ring-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all duration-300" {...field} />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-base font-medium group-hover/input:text-green-500 transition-colors">km</span>
                              </div>
                            </FormControl>
                            <FormDescription id="transport-desc">Distance traveled by car per month.</FormDescription>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="electricity"
                      render={({ field }) => (
                        <FormItem className="group">
                          <FormLabel className="flex items-center gap-2 group-focus-within:text-yellow-500 transition-colors relative text-base font-semibold">
                            <Zap className="w-5 h-5" /> Electricity Usage
                            <div className="relative group/info ml-1 inline-flex items-center">
                              <Info className="w-4 h-4 text-muted-foreground group-hover/info:text-yellow-500 transition-colors cursor-help" />
                              <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-card border shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all duration-300 text-xs font-normal text-muted-foreground pointer-events-none opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible">
                                <span className="font-bold text-yellow-500 block mb-1">Eco-Tip: Energy</span>
                                Phantom energy (devices plugged in but off) accounts for 10% of home electricity. Unplug chargers to reduce baseline draw!
                              </div>
                            </div>
                          </FormLabel>
                          <FormControl>
                              <div className="relative group/input">
                                <Input type="number" aria-describedby="electricity-desc" className="h-14 text-lg pl-4 pr-14 focus-visible:ring-yellow-500 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)] transition-all duration-300" {...field} />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-base font-medium group-hover/input:text-yellow-500 transition-colors">kWh</span>
                              </div>
                            </FormControl>
                            <FormDescription id="electricity-desc">Home electricity usage per month.</FormDescription>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="food"
                      render={({ field }) => (
                        <FormItem className="group">
                          <FormLabel className="flex items-center gap-2 group-focus-within:text-orange-500 transition-colors relative text-base font-semibold">
                            <Utensils className="w-5 h-5" /> Food Waste
                            <div className="relative group/info ml-1 inline-flex items-center">
                              <Info className="w-4 h-4 text-muted-foreground group-hover/info:text-orange-500 transition-colors cursor-help" />
                              <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-card border shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-300 text-xs font-normal text-muted-foreground pointer-events-none opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible">
                                <span className="font-bold text-orange-500 block mb-1">Eco-Tip: Diet</span>
                                Beef emits 20x more GHGs than plant proteins. Eating local and seasonal slashes transport emissions.
                              </div>
                            </div>
                          </FormLabel>
                          <FormControl>
                              <div className="relative group/input">
                                <Input type="number" aria-describedby="food-desc" className="h-14 text-lg pl-4 pr-12 focus-visible:ring-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all duration-300" {...field} />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-base font-medium group-hover/input:text-orange-500 transition-colors">kg</span>
                              </div>
                            </FormControl>
                            <FormDescription id="food-desc" className="sr-only">Monthly food waste in kg</FormDescription>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="waste"
                      render={({ field }) => (
                        <FormItem className="group">
                          <FormLabel className="flex items-center gap-2 group-focus-within:text-stone-500 transition-colors relative text-base font-semibold">
                            <Trash2 className="w-5 h-5" /> General Waste
                            <div className="relative group/info ml-1 inline-flex items-center">
                              <Info className="w-4 h-4 text-muted-foreground group-hover/info:text-stone-500 transition-colors cursor-help" />
                              <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-card border shadow-[0_0_20px_rgba(120,113,108,0.3)] transition-all duration-300 text-xs font-normal text-muted-foreground pointer-events-none opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible">
                                <span className="font-bold text-stone-500 block mb-1">Eco-Tip: Waste</span>
                                Organic waste in landfills produces methane, a gas 25x more potent than CO2. Composting is the key!
                              </div>
                            </div>
                          </FormLabel>
                          <FormControl>
                              <div className="relative group/input">
                                <Input type="number" aria-describedby="waste-desc" className="h-14 text-lg pl-4 pr-12 focus-visible:ring-stone-500 hover:shadow-[0_0_15px_rgba(120,113,108,0.2)] transition-all duration-300" {...field} />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-base font-medium group-hover/input:text-stone-500 transition-colors">kg</span>
                              </div>
                            </FormControl>
                            <FormDescription id="waste-desc" className="sr-only">Monthly solid waste in kg</FormDescription>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {error && (
                    <motion.div variants={itemVariants} className="p-3 bg-red-500/10 text-red-600 rounded-md flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4" /> {error}
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants} className="pt-4 mt-auto">
                    <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white transition-all hover:shadow-[0_0_30px_rgba(22,163,74,0.4)] hover:-translate-y-1 font-bold rounded-xl">
                      {isSubmitting ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Calculator className="w-4 h-4 mr-2" />
                      )}
                      {isSubmitting ? "Calculating with AI..." : "Calculate Footprint"}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </Form>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.4 }} className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/30 text-center relative overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.15)]">
              <motion.div 
                initial={{ rotate: -90, scale: 0 }} 
                animate={{ rotate: 0, scale: 1 }} 
                transition={{ type: "spring", delay: 0.2 }}
                className="absolute top-0 right-0 p-4 opacity-10"
              >
                <CheckCircle2 className="w-32 h-32 text-green-500" />
              </motion.div>
              
              <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">Calculation Success</h2>
              
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col items-center justify-center gap-1 my-6">
                <span className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-green-600 to-emerald-400">
                  {result.monthly.toFixed(1)}
                </span>
                <span className="text-muted-foreground font-medium uppercase tracking-widest text-xs mt-2">kg CO₂e per month</span>
              </motion.div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Annual Estimate: <span className="font-bold text-foreground">{result.annual.toFixed(1)} kg CO₂e</span>
              </p>
            </div>

            {/* Gemini AI Advice Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6 }}
              className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500" />
              <div className="flex gap-3">
                <Sparkles className="w-6 h-6 text-blue-500 flex-shrink-0 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1">Gemini AI Insight</h3>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {isGettingAdvice ? (
                      <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin" /> Analyzing your footprint...</span>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <span>{geminiAdvice}</span>
                        {geminiAdvice && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-fit mt-1 border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
                            onClick={async () => {
                              try {
                                const highestCategory = Object.keys(result!.categoryBreakdown).reduce((a, b) => result!.categoryBreakdown[a as keyof typeof result.categoryBreakdown] > result!.categoryBreakdown[b as keyof typeof result.categoryBreakdown] ? a : b);
                                await fetch('/api/goals', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    description: `Reduce ${highestCategory} emissions by 10% this month (AI Suggested)`,
                                    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                                  })
                                });
                                alert("AI Goal automatically added to your dashboard!");
                              } catch(e) {
                                void(e);
                              }
                            }}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            1-Click: Add Auto-Goal to Dashboard
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Travel', icon: Car, color: 'text-green-500', value: result.categoryBreakdown.transportation },
                { label: 'Power', icon: Zap, color: 'text-yellow-500', value: result.categoryBreakdown.electricity },
                { label: 'Food', icon: Utensils, color: 'text-orange-500', value: result.categoryBreakdown.food },
                { label: 'Waste', icon: Trash2, color: 'text-stone-500', value: result.categoryBreakdown.waste }
              ].map((item, i) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="p-3 rounded-xl bg-card border flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="flex items-center gap-2 text-sm font-medium"><item.icon className={`w-4 h-4 ${item.color}`} /> {item.label}</span>
                  <span className="font-bold">{item.value.toFixed(0)}</span>
                </motion.div>
              ))}
            </div>

            <Button onClick={handleReset} variant="outline" className="w-full mt-4 hover:bg-muted transition-all hover:scale-[1.02]">
              Calculate Again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
