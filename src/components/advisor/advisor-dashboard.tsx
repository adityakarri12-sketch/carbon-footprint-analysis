"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Zap, TreePine, Loader2, ArrowRight, Globe, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";

interface ActionStep {
  title: string;
  impact: string;
  description: string;
}

interface PlaceData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

// Subcomponent to handle map panning programmatically
function MapController({ center, zoom }: { center: {lat: number, lng: number}, zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);

  return null;
}

const COUNTRIES = [
  "India",
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "Japan"
];

export function AdvisorDashboard({ mapsApiKey }: { mapsApiKey: string }) {
  const [plan, setPlan] = useState<ActionStep[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Map States - Defaulting to India
  const [mapFilter, setMapFilter] = useState<'recycling' | 'ev'>('recycling');
  const [country, setCountry] = useState("India");
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapZoom, setMapZoom] = useState(5);
  const [places, setPlaces] = useState<PlaceData[]>([]);
  const [isMapLoading, setIsMapLoading] = useState(false);
  
  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Adopt goal state
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
      const res = await fetch('/api/gemini/plan', { method: 'POST' });
      const data = await res.json();
      setPlan(data.plan);
    } catch (e) {
      console.error(e);
      setPlan([
        { title: "Reduce Driving", impact: "High", description: "Carpool 2 days a week to save 15%." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Geocode when Country changes
  useEffect(() => {
    const fetchGeocode = async () => {
      setIsMapLoading(true);
      try {
        const res = await fetch(`/api/maps/geocode?address=${encodeURIComponent(country)}`);
        const data = await res.json();
        if (res.ok && data.lat) {
          setMapCenter({ lat: data.lat, lng: data.lng });
          setMapZoom(data.zoom || 5);
        }
      } catch (e) {
        console.error("Failed to geocode country", e);
      }
    };
    fetchGeocode();
  }, [country]);

  // Fetch Places when mapCenter or mapFilter changes
  useEffect(() => {
    const fetchPlaces = async () => {
      setIsMapLoading(true);
      try {
        const res = await fetch(`/api/maps/places?lat=${mapCenter.lat}&lng=${mapCenter.lng}&type=${mapFilter}`);
        const data = await res.json();
        if (res.ok && data.places) {
          setPlaces(data.places);
        }
      } catch (e) {
        console.error("Failed to fetch places", e);
        setPlaces([]); // clear on error
      } finally {
        setIsMapLoading(false);
      }
    };
    if (mapCenter.lat !== 0) {
      fetchPlaces();
    }
  }, [mapCenter, mapFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      
      <div aria-live="polite" className="sr-only">
        {isLoading ? "Generating your AI action plan..." : plan ? "Action plan generated successfully." : ""}
        {isMapLoading ? "Fetching map data..." : `Showing ${places.length} results for ${mapFilter} in ${country}.`}
      </div>

      {/* AI Action Planner Section */}
      <section aria-labelledby="ai-planner-heading" className="p-6 rounded-3xl bg-card border shadow-sm relative group overflow-hidden">
        <header className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <h2 id="ai-planner-heading" className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-500" /> AI Action Planner
            </h2>
            <p className="text-muted-foreground mt-1">Gemini analyzes your history to build a custom reduction plan.</p>
          </div>
          <Button 
            onClick={generatePlan} 
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all focus-visible:ring-4 focus-visible:ring-indigo-500/50 outline-none"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2" />}
            {isLoading ? "Analyzing..." : "Generate Plan"}
          </Button>
        </header>

        <AnimatePresence mode="wait">
          {plan ? (
            <motion.div 
              key="plan"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10"
            >
              {plan.map((step, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
                      {idx + 1}
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-background border shadow-sm text-muted-foreground uppercase">
                      {step.impact} Impact
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-indigo-500/10 focus-visible:ring-2 focus-visible:ring-indigo-500"
                    onClick={() => adoptGoal(step, idx)}
                    disabled={adoptingIndex === idx || adoptedIndices.includes(idx)}
                  >
                    {adoptedIndices.includes(idx) ? (
                      <>Adopted <Check className="w-4 h-4 ml-2 text-green-500" /></>
                    ) : adoptingIndex === idx ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Adopting...</>
                    ) : (
                      <>Adopt Goal <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" /></>
                    )}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center p-6 bg-muted/20 relative z-10"
            >
              <TreePine className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground max-w-sm">
                Click "Generate Plan" to allow Gemini to analyze your data and build your personalized eco-roadmap.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Local Resources Map Section */}
      <section aria-labelledby="map-heading" className="p-6 rounded-3xl bg-card border shadow-sm">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 id="map-heading" className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="w-6 h-6 text-green-500" /> Local Eco-Resources
            </h2>
            <p className="text-muted-foreground mt-1">Discover live recycling centers and EV charging near you.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            
            {/* Highly Animated Custom Country Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-muted px-4 py-2 rounded-xl border hover:bg-muted/80 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-green-500 outline-none w-[180px] justify-between"
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
                  {country}
                </div>
                <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute z-50 top-full mt-2 w-full bg-background border rounded-xl shadow-xl overflow-hidden py-1"
                    role="listbox"
                  >
                    {COUNTRIES.map((c) => (
                      <li key={c}>
                        <button
                          onClick={() => { setCountry(c); setDropdownOpen(false); }}
                          role="option"
                          aria-selected={country === c}
                          className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 transition-colors flex items-center justify-between group"
                        >
                          {c}
                          {country === c && <Check className="w-4 h-4 text-green-500" />}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Keyboard navigable segmented control */}
            <div 
              className="flex p-1 bg-muted rounded-xl shadow-inner"
              role="radiogroup" 
              aria-label="Map resource filter"
            >
              <button
                role="radio"
                aria-checked={mapFilter === 'recycling'}
                onClick={() => setMapFilter('recycling')}
                className={`relative px-4 py-2 rounded-lg text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-green-500 outline-none ${mapFilter === 'recycling' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {mapFilter === 'recycling' && (
                  <motion.div layoutId="filter-indicator" className="absolute inset-0 bg-background rounded-lg shadow-sm -z-10" />
                )}
                Recycling
              </button>
              <button
                role="radio"
                aria-checked={mapFilter === 'ev'}
                onClick={() => setMapFilter('ev')}
                className={`relative px-4 py-2 rounded-lg text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-green-500 outline-none ${mapFilter === 'ev' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {mapFilter === 'ev' && (
                  <motion.div layoutId="filter-indicator" className="absolute inset-0 bg-background rounded-lg shadow-sm -z-10" />
                )}
                EV Charging
              </button>
            </div>
          </div>
        </header>

        <div className="h-[400px] rounded-2xl overflow-hidden border relative bg-slate-100 dark:bg-slate-900 shadow-inner group">
          
          {isMapLoading && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[2px] flex items-center justify-center"
            >
               <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </motion.div>
          )}

          <APIProvider apiKey={mapsApiKey}>
            <Map
              defaultZoom={mapZoom}
              defaultCenter={mapCenter}
              mapId="DEMO_MAP_ID"
              disableDefaultUI={true}
              gestureHandling="cooperative"
              className="w-full h-full transition-transform duration-1000 group-hover:scale-[1.01]"
            >
              <MapController center={mapCenter} zoom={mapZoom} />

              {React.useMemo(() => places.map((loc, i) => (
                <AdvancedMarker key={loc.id || i} position={{ lat: loc.lat, lng: loc.lng }}>
                  <Pin 
                    background={mapFilter === 'recycling' ? "#22c55e" : "#3b82f6"} 
                    borderColor={mapFilter === 'recycling' ? "#16a34a" : "#2563eb"} 
                    glyphColor={"#ffffff"} 
                    scale={1.2}
                  />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur px-3 py-1.5 rounded-lg border shadow-lg text-xs font-bold whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    {loc.name}
                  </div>
                </AdvancedMarker>
              )), [places, mapFilter])}
            </Map>
          </APIProvider>
        </div>
      </section>

    </motion.div>
  );
}
