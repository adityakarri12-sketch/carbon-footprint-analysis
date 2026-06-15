"use client";

import { Trophy, Medal, Flame, Sparkles, RefreshCw, Activity } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

interface LeaderboardUser {
  rank: number;
  name: string;
  saved: number;
  isCurrentUser?: boolean;
}

const leaderboardDataAllTime: LeaderboardUser[] = [
  { rank: 1, name: "EcoGuru_99", saved: 1250 },
  { rank: 2, name: "GreenPlanet", saved: 980 },
  { rank: 3, name: "SolarKing", saved: 850 },
  { rank: 4, name: "EarthDefender", saved: 720 },
  { rank: 5, name: "OceanSaver", saved: 650 },
  { rank: 42, name: "You", saved: 120, isCurrentUser: true },
];

const leaderboardDataWeekly: LeaderboardUser[] = [
  { rank: 1, name: "SolarKing", saved: 150 },
  { rank: 2, name: "GreenPlanet", saved: 120 },
  { rank: 3, name: "EcoGuru_99", saved: 95 },
  { rank: 4, name: "OceanSaver", saved: 80 },
  { rank: 5, name: "You", saved: 45, isCurrentUser: true },
  { rank: 6, name: "EarthDefender", saved: 40 },
];

const mockLocations = [
  { lat: 40.7128, lng: -74.0060, weight: 10 },
  { lat: 34.0522, lng: -118.2437, weight: 8 },
  { lat: 51.5074, lng: -0.1278, weight: 15 },
  { lat: 48.8566, lng: 2.3522, weight: 12 },
  { lat: 35.6762, lng: 139.6503, weight: 20 },
  { lat: -33.8688, lng: 151.2093, weight: 7 },
  { lat: 1.3521, lng: 103.8198, weight: 18 }
];

const liveActivities = [
  "Sarah just recycled 5kg of plastic! ♻️",
  "Mike switched to solar power today! ☀️",
  "Elena took public transit, saving 2kg CO2! 🚌",
  "David planted a tree in his backyard! 🌳",
  "Anna completed the 'Zero Waste Week' challenge! 🏆"
];

export function CommunityDashboard({ apiKey }: { apiKey: string }) {
  const [geminiSummary, setGeminiSummary] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'week' | 'all'>('week');
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setGeminiSummary("The community saved 42,500kg of CO2 this week—that's equivalent to planting over 2,000 mature trees or taking 9 cars off the road for a year!");
    }, 1500);

    const activityInterval = setInterval(() => {
      setCurrentActivityIndex(prev => (prev + 1) % liveActivities.length);
    }, 4000);

    return () => clearInterval(activityInterval);
  }, []);

  const activeLeaderboard = timeFilter === 'week' ? leaderboardDataWeekly : leaderboardDataAllTime;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <APIProvider apiKey={apiKey}>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
        
        {/* Gemini AI Insight Banner */}
        <motion.div variants={itemVariants} className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 relative overflow-hidden group shadow-[0_0_30px_rgba(34,197,94,0.15)] hover:shadow-[0_0_40px_rgba(34,197,94,0.25)] transition-all duration-500">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-green-400 to-blue-500 animate-pulse" />
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center relative z-10">
            <div className="flex-shrink-0 bg-green-500/20 p-3 rounded-full relative">
              <div className="absolute inset-0 bg-green-500/30 rounded-full animate-ping opacity-50" />
              <Sparkles className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-green-600 dark:text-green-400 mb-1 tracking-wide uppercase flex items-center gap-2">
                Gemini Community Insight
              </h3>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {!geminiSummary ? (
                  <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin text-green-500" /> Analyzing global impact...</span>
                ) : (
                  geminiSummary
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-sm font-semibold">
          <Activity className="w-5 h-5 text-indigo-500 animate-pulse" />
          <span className="text-muted-foreground uppercase text-xs tracking-wider border-r border-indigo-500/30 pr-3">Live</span>
          <div className="relative h-5 flex-1 overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentActivityIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 text-indigo-700 dark:text-indigo-300"
              >
                {liveActivities[currentActivityIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Global Impact TRUE Heatmap */}
        <motion.div variants={itemVariants} className="h-[350px] rounded-2xl overflow-hidden border border-border relative bg-slate-900 group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 pointer-events-none" />
          <Map
            defaultZoom={2}
            defaultCenter={{ lat: 20, lng: 0 }}
            mapId="DEMO_MAP_ID"
            disableDefaultUI={true}
            gestureHandling="cooperative"
            className="w-full h-full grayscale opacity-80 mix-blend-screen"
          >
            {mockLocations.map((loc, i) => {
              const size = Math.max(30, loc.weight * 3);
              return (
                <AdvancedMarker key={i} position={{ lat: loc.lat, lng: loc.lng }}>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2 + ((i % 5) * 0.2) }}
                    className="rounded-full bg-red-500 mix-blend-screen pointer-events-none drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]"
                    style={{ 
                      width: `${size}px`, 
                      height: `${size}px`, 
                      filter: `blur(${size/5}px)`,
                      transform: 'translate(-50%, -50%)'
                    }} 
                  />
                </AdvancedMarker>
              );
            })}
          </Map>
          <div className="absolute bottom-6 left-6 z-20 bg-background/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-2xl flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 rounded-full blur-md animate-pulse opacity-70" />
              <Flame className="w-5 h-5 text-orange-400 relative z-10" />
            </div>
            <span className="text-sm font-extrabold tracking-wide">Live Global Thermal Activity</span>
          </div>
        </motion.div>

        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black">Top Eco-Warriors</h2>
            <p className="text-muted-foreground text-sm font-medium">Competition breeds sustainability.</p>
          </div>
          <div className="flex bg-muted p-1 rounded-lg border">
            <button 
              onClick={() => setTimeFilter('week')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${timeFilter === 'week' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              This Week
            </button>
            <button 
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${timeFilter === 'all' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              All Time
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Floating 3D Podium */}
          <motion.div variants={itemVariants} className="md:col-span-3 grid grid-cols-3 gap-4 items-end h-[320px] mb-4 relative perspective-1000">
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-green-500/20 to-transparent blur-2xl" />
            
            {/* Rank 2 */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, type: "spring" }}
              className="flex flex-col items-center group relative z-10 hover:-translate-y-4 transition-transform duration-500 cursor-pointer"
            >
              <div className="mb-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-400 dark:from-slate-700 dark:to-slate-800 rounded-full mx-auto mb-2 border-4 border-gray-300 dark:border-gray-500 flex items-center justify-center shadow-[0_0_20px_rgba(156,163,175,0.4)] group-hover:shadow-[0_0_30px_rgba(156,163,175,0.8)] transition-all">
                  <span className="font-black text-gray-700 dark:text-gray-300 text-xl">2</span>
                </div>
                <span className="font-bold">{activeLeaderboard[1]?.name || "-"}</span>
              </div>
              <div className="w-full bg-gradient-to-t from-gray-300 to-gray-100 dark:from-slate-800 dark:to-slate-600 h-[120px] rounded-t-2xl flex justify-center pt-5 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.1)] border-t border-x border-gray-300 dark:border-slate-500 relative overflow-hidden transform-style-3d group-hover:brightness-110 transition-all">
                <div className="absolute inset-0 bg-white/20 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="font-black text-gray-700 dark:text-gray-300 drop-shadow-md">{activeLeaderboard[1]?.saved || 0} kg</span>
              </div>
            </motion.div>
            
            {/* Rank 1 */}
            <motion.div 
              initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, type: "spring", bounce: 0.5 }}
              className="flex flex-col items-center group relative z-20 hover:-translate-y-6 transition-transform duration-500 cursor-pointer"
            >
              <div className="mb-4 text-center relative">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                  <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2 drop-shadow-[0_0_25px_rgba(250,204,21,0.8)]" />
                </motion.div>
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-300 dark:from-yellow-700 dark:to-yellow-900 rounded-full mx-auto mb-2 border-[5px] border-yellow-400 flex items-center justify-center shadow-[0_0_40px_rgba(250,204,21,0.5)] group-hover:shadow-[0_0_60px_rgba(250,204,21,0.9)] transition-all">
                  <span className="font-black text-yellow-700 dark:text-yellow-400 text-4xl drop-shadow-md">1</span>
                </div>
                <span className="font-bold text-xl">{activeLeaderboard[0]?.name || "-"}</span>
              </div>
              <div className="w-full bg-gradient-to-t from-yellow-300 to-yellow-100 dark:from-yellow-900/80 dark:to-yellow-700/60 h-[180px] rounded-t-2xl flex justify-center pt-5 shadow-[inset_0_-10px_30px_rgba(0,0,0,0.15)] border-t border-x border-yellow-400 dark:border-yellow-600 relative overflow-hidden group-hover:brightness-110 transition-all">
                <div className="absolute inset-0 bg-white/20 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="font-black text-yellow-800 dark:text-yellow-400 text-xl drop-shadow-md">{activeLeaderboard[0]?.saved || 0} kg</span>
              </div>
            </motion.div>

            {/* Rank 3 */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, type: "spring" }}
              className="flex flex-col items-center group relative z-10 hover:-translate-y-4 transition-transform duration-500 cursor-pointer"
            >
              <div className="mb-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-300 dark:from-amber-800 dark:to-amber-900 rounded-full mx-auto mb-2 border-4 border-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.8)] transition-all">
                  <span className="font-black text-amber-800 dark:text-amber-400 text-xl">3</span>
                </div>
                <span className="font-bold">{activeLeaderboard[2]?.name || "-"}</span>
              </div>
              <div className="w-full bg-gradient-to-t from-amber-300 to-amber-100 dark:from-amber-900/60 dark:to-amber-800/40 h-[90px] rounded-t-2xl flex justify-center pt-5 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.1)] border-t border-x border-amber-400 dark:border-amber-700 relative overflow-hidden group-hover:brightness-110 transition-all">
                <div className="absolute inset-0 bg-white/20 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="font-black text-amber-800 dark:text-amber-400 drop-shadow-md">{activeLeaderboard[2]?.saved || 0} kg</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Table View */}
          <motion.div variants={itemVariants} className="md:col-span-3 rounded-2xl border bg-card/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            <Table>
              <TableHeader className="bg-muted/80">
                <TableRow className="border-b-2">
                  <TableHead className="w-24 text-center font-bold">Rank</TableHead>
                  <TableHead className="font-bold">Eco-Warrior</TableHead>
                  <TableHead className="text-right font-bold">CO₂ Saved</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="wait">
                  {activeLeaderboard.map((row, i) => (
                    <motion.tr 
                      key={`${timeFilter}-${row.rank}`}
                      initial={{ opacity: 0, x: -20, backgroundColor: 'rgba(0,0,0,0)' }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(34,197,94,0.05)' }}
                      className={`border-b transition-colors cursor-pointer group ${row.isCurrentUser ? 'bg-green-500/10 hover:bg-green-500/20 shadow-[inset_4px_0_0_0_rgba(34,197,94,1)]' : 'hover:bg-muted/50'}`}
                    >
                      <TableCell className="text-center font-mono font-black text-lg">
                        {row.rank === 1 && <Trophy className="w-6 h-6 text-yellow-500 mx-auto drop-shadow-md group-hover:scale-125 transition-transform" />}
                        {row.rank === 2 && <Medal className="w-6 h-6 text-gray-400 mx-auto drop-shadow-md group-hover:scale-125 transition-transform" />}
                        {row.rank === 3 && <Medal className="w-6 h-6 text-amber-500 mx-auto drop-shadow-md group-hover:scale-125 transition-transform" />}
                        {row.rank > 3 && <span className="text-muted-foreground group-hover:text-foreground transition-colors">#{row.rank}</span>}
                      </TableCell>
                      <TableCell className="font-bold text-base flex items-center gap-3 py-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs shadow-md">
                          {row.name.charAt(0)}
                        </div>
                        {row.name}
                        {row.isCurrentUser && <span className="text-xs bg-green-500 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse">You</span>}
                      </TableCell>
                      <TableCell className="text-right font-mono font-black text-green-600 dark:text-green-400 text-lg">
                        <motion.span whileHover={{ scale: 1.1 }} className="inline-block">
                          {row.saved.toLocaleString()} kg
                        </motion.span>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </motion.div>
        </div>
      </motion.div>
    </APIProvider>
  );
}
