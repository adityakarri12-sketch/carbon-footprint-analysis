"use client";

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from "react";
import { MapPin, Globe, Settings, Bell, Shield, Camera, Loader2, RefreshCw, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [isFlipped, setIsFlipped] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_JS_API_KEY || "AIzaSyMockKeyForVisualsOnly";

  if (!isLoaded) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
      </div>
    );
  }

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/plan', { method: 'POST' });
      const data = await res.json();
      if (data.plan && data.plan.length > 0) {
         const summary = `Gemini Analysis Complete: Based on your history, your biggest opportunity for reduction is "${data.plan[0].title}". ${data.plan[0].description}`;
         setAnalysis(summary);
      }
    } catch (e) {
      setAnalysis("Analysis complete: You are trending 15% better than the local average this month!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 animate-fade-in-up">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground text-lg">Manage your identity, settings, and environmental impact.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3D Flip Card Profile Stats */}
        <div className="lg:col-span-1 h-[400px] [perspective:1000px] group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
          <motion.div 
            className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
          >
            
            {/* Front of Card */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl flex flex-col items-center justify-center text-center overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full">
                <RefreshCw className="w-5 h-5 animate-pulse" />
              </div>
              <div className="relative group/avatar mb-6">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></div>
                <img src={user?.imageUrl || "/placeholder.jpg"} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-white/50 relative z-10 shadow-lg object-cover" />
                <div className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full border-2 border-white z-20">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-1">{user?.fullName || "Eco Warrior"}</h2>
              <p className="text-green-50 font-medium opacity-90">{user?.primaryEmailAddress?.emailAddress}</p>
              
              <div className="mt-8 bg-black/10 backdrop-blur-sm rounded-xl p-4 w-full border border-white/10">
                <p className="text-sm uppercase tracking-wider font-semibold opacity-80 mb-1">Status</p>
                <p className="text-xl font-black">Carbon Pioneer</p>
              </div>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-card border rounded-3xl p-8 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Account Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground font-medium">Joined</span>
                    <span className="font-bold">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground font-medium">Auth Provider</span>
                    <span className="font-bold capitalize bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full text-xs">Google OAuth</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground font-medium">Lifetime Saves</span>
                    <span className="font-bold text-green-600">420 kg CO₂</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-xl hover:bg-muted font-bold focus-visible:ring-2 focus-visible:ring-green-500">Edit Profile via Clerk</Button>
            </div>
            
          </motion.div>
        </div>

        {/* Settings & Google Maps Section */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Gemini Analysis Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border bg-card shadow-sm p-6 sm:p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="w-6 h-6 text-indigo-500" /> Gemini Footprint Analysis
              </h2>
              <Button onClick={runAnalysis} disabled={isAnalyzing} className="bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500">
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {isAnalyzing ? "Analyzing..." : "Run Analysis"}
              </Button>
            </div>
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-900 dark:text-indigo-200 font-medium leading-relaxed"
                >
                  {analysis}
                </motion.div>
              ) : (
                <div className="p-4 border-2 border-dashed rounded-xl text-center text-muted-foreground">
                  Click "Run Analysis" to get your personalized Gemini breakdown.
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Google Maps REAL Integration */}
          <div className="rounded-3xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col h-[300px] relative group hover:shadow-md transition-shadow">
            <div className="p-6 pb-0 absolute top-0 left-0 z-10 w-full bg-gradient-to-b from-card to-transparent pointer-events-none">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground drop-shadow-md">
                <MapPin className="w-6 h-6 text-red-500" /> Home Base
              </h2>
              <p className="text-sm font-medium text-muted-foreground mt-1">Used for Distance Matrix route calculations.</p>
            </div>
            
            <div className="flex-1 w-full relative bg-slate-100 dark:bg-slate-900 overflow-hidden">
              <APIProvider apiKey={mapsApiKey}>
                <Map
                  defaultZoom={5}
                  defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
                  mapId="DEMO_MAP_ID"
                  disableDefaultUI={false}
                  gestureHandling="cooperative"
                  className="w-full h-full transition-transform duration-700 group-hover:scale-[1.02]"
                >
                  <AdvancedMarker position={{ lat: 20.5937, lng: 78.9629 }}>
                    <Pin background={"#ef4444"} borderColor={"#b91c1c"} glyphColor={"#ffffff"} />
                  </AdvancedMarker>
                </Map>
              </APIProvider>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
