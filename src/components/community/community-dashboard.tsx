"use client";

import { Trophy, Medal, Flame, Users, TrendingUp, MapPin, Sparkles, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

interface LeaderboardUser {
  rank: number;
  name: string;
  saved: number;
  isCurrentUser?: boolean;
}

const leaderboardData: LeaderboardUser[] = [
  { rank: 1, name: "EcoGuru_99", saved: 1250 },
  { rank: 2, name: "GreenPlanet", saved: 980 },
  { rank: 3, name: "SolarKing", saved: 850 },
  { rank: 4, name: "EarthDefender", saved: 720 },
  { rank: 5, name: "OceanSaver", saved: 650 },
  { rank: 42, name: "You", saved: 120, isCurrentUser: true },
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



export function CommunityDashboard({ apiKey }: { apiKey: string }) {
  const [geminiSummary, setGeminiSummary] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setGeminiSummary("The community saved 42,500kg of CO2 this week—that's equivalent to planting over 2,000 mature trees or taking 9 cars off the road for a year!");
    }, 1500);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <APIProvider apiKey={apiKey}>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
        
        {/* Gemini AI Insight Banner */}
        <motion.div variants={itemVariants} className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-500 to-blue-500" />
          <div className="flex gap-3 items-center">
            <Sparkles className="w-8 h-8 text-green-500 flex-shrink-0 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-green-600 dark:text-green-400 mb-1">Gemini Community Insight</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {!geminiSummary ? (
                  <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin" /> Analyzing global impact...</span>
                ) : (
                  geminiSummary
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Global Impact TRUE Heatmap */}
        <motion.div variants={itemVariants} className="h-[300px] rounded-2xl overflow-hidden border border-border relative bg-slate-900 group shadow-lg">
          <div className="absolute inset-0 bg-blue-500/5 z-10 pointer-events-none group-hover:bg-transparent transition-colors" />
          <Map
            defaultZoom={2}
            defaultCenter={{ lat: 20, lng: 0 }}
            mapId="DEMO_MAP_ID"
            disableDefaultUI={true}
            gestureHandling="cooperative"
            className="w-full h-full grayscale opacity-90"
          >
            {mockLocations.map((loc, i) => {
              // Calculate orb size and opacity based on weight to simulate thermal intensity
              const size = Math.max(30, loc.weight * 3);
              return (
                <AdvancedMarker key={i} position={{ lat: loc.lat, lng: loc.lng }}>
                  <div 
                    className="rounded-full bg-red-500/60 animate-pulse mix-blend-screen pointer-events-none"
                    style={{ 
                      width: `${size}px`, 
                      height: `${size}px`, 
                      filter: `blur(${size/4}px)`,
                      transform: 'translate(-50%, -50%)'
                    }} 
                  />
                </AdvancedMarker>
              );
            })}
          </Map>
          <div className="absolute bottom-4 left-4 z-20 bg-background/90 backdrop-blur px-3 py-2 rounded-lg border shadow-lg flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-xs font-bold">Live Global Thermal Activity</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Floating 3D Podium */}
          <motion.div variants={itemVariants} className="md:col-span-3 grid grid-cols-3 gap-4 items-end h-[280px] mb-8 relative">
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-green-500/10 to-transparent blur-xl" />
            
            {/* Rank 2 */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, type: "spring" }}
              className="flex flex-col items-center group relative z-10 hover:-translate-y-4 transition-transform duration-500 cursor-pointer"
            >
              <div className="mb-4 text-center">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-2 border-4 border-gray-300 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(156,163,175,0.5)] transition-all">
                  <span className="font-bold text-gray-500">2</span>
                </div>
                <span className="font-bold">{leaderboardData[1].name}</span>
              </div>
              <div className="w-full bg-gradient-to-t from-gray-200 to-gray-100 dark:from-slate-800 dark:to-slate-700 h-[100px] rounded-t-xl flex justify-center pt-4 shadow-inner border border-b-0 border-gray-300 dark:border-slate-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="font-bold text-muted-foreground">{leaderboardData[1].saved} kg</span>
              </div>
            </motion.div>
            
            {/* Rank 1 */}
            <motion.div 
              initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, type: "spring", bounce: 0.5 }}
              className="flex flex-col items-center group relative z-20 hover:-translate-y-6 transition-transform duration-500 cursor-pointer"
            >
              <div className="mb-4 text-center relative">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-2 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                </motion.div>
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-2 border-4 border-yellow-400 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.3)] group-hover:shadow-[0_0_40px_rgba(234,179,8,0.6)] transition-all">
                  <span className="font-bold text-yellow-600 text-2xl">1</span>
                </div>
                <span className="font-bold text-xl">{leaderboardData[0].name}</span>
              </div>
              <div className="w-full bg-gradient-to-t from-yellow-200 to-yellow-100 dark:from-yellow-900/60 dark:to-yellow-800/40 h-[150px] rounded-t-xl flex justify-center pt-4 shadow-inner border border-b-0 border-yellow-300 dark:border-yellow-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="font-bold text-yellow-700 dark:text-yellow-500 text-lg">{leaderboardData[0].saved} kg</span>
              </div>
            </motion.div>

            {/* Rank 3 */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, type: "spring" }}
              className="flex flex-col items-center group relative z-10 hover:-translate-y-4 transition-transform duration-500 cursor-pointer"
            >
              <div className="mb-4 text-center">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-2 border-4 border-amber-600 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(217,119,6,0.5)] transition-all">
                  <span className="font-bold text-amber-700 dark:text-amber-500">3</span>
                </div>
                <span className="font-bold">{leaderboardData[2].name}</span>
              </div>
              <div className="w-full bg-gradient-to-t from-amber-200 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/30 h-[80px] rounded-t-xl flex justify-center pt-4 shadow-inner border border-b-0 border-amber-300 dark:border-amber-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="font-bold text-amber-700 dark:text-amber-500">{leaderboardData[2].saved} kg</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Table View */}
          <motion.div variants={itemVariants} className="md:col-span-3 rounded-2xl border bg-card shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-24 text-center">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">CO₂ Saved (Lifetime)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((row, i) => (
                  <motion.tr 
                    key={row.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (i * 0.1) }}
                    className={`border-b transition-colors ${row.isCurrentUser ? 'bg-green-500/10 hover:bg-green-500/20' : 'hover:bg-muted/50'}`}
                  >
                    <TableCell className="text-center font-mono font-bold">
                      {row.rank === 1 && <Trophy className="w-5 h-5 text-yellow-500 mx-auto" />}
                      {row.rank === 2 && <Medal className="w-5 h-5 text-gray-400 mx-auto" />}
                      {row.rank === 3 && <Medal className="w-5 h-5 text-amber-600 mx-auto" />}
                      {row.rank > 3 && `#${row.rank}`}
                    </TableCell>
                    <TableCell className="font-semibold flex items-center gap-2">
                      {row.name}
                      {row.isCurrentUser && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.5)]">You</span>}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-green-600 dark:text-green-400">
                      {row.saved.toLocaleString()} kg
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </div>
      </motion.div>
    </APIProvider>
  );
}
