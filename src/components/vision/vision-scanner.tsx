"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Image as ImageIcon, Leaf, Zap, RefreshCcw, CheckCircle2, ChevronRight, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Material {
  name: string;
  percentage: number;
}

interface AnalysisResult {
  itemName: string;
  estimatedFootprint: number;
  ecoAlternative: string;
  details: string;
  materials: Material[];
}

export function VisionScanner() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLogged, setIsLogged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_MB = 5;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResult(null);
    
    // Security: Validate file size before loading into memory
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Please upload an image smaller than ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    
    setImagePreview(null);
    setIsLogged(false);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      analyzeImage(base64String, file.type);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64Url: string, mimeType: string) => {
    setIsLoading(true);
    try {
      // Extract the raw base64 data (remove the data:image/...;base64, prefix)
      const base64Data = base64Url.split(',')[1];
      
      const res = await fetch('/api/gemini/vision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          base64Image: base64Data,
          mimeType: mimeType
        })
      });

      if (!res.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await res.json();
      
      // Standardize response fields to match UI expectations
      setResult({
        itemName: data.itemName || "Unknown Object",
        estimatedFootprint: data.estimatedFootprint || 0,
        ecoAlternative: data.ecoAlternative || "N/A",
        details: data.details || "",
        materials: data.materials || []
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to analyze image");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      triggerUpload();
    }
  };

  const reset = () => {
    setImagePreview(null);
    setResult(null);
    setIsLogged(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const logAction = () => {
    setIsLogged(true);
    // Here you would trigger an API call to save to user profile
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 relative">
      
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Upload Section */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative bg-card/60 backdrop-blur-xl border-2 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col items-center justify-center min-h-[500px] group transition-all duration-500 hover:border-indigo-500/50 hover:shadow-[0_0_40px_rgba(99,102,241,0.2)]"
        >
          {/* Animated gradient border when loading */}
          {isLoading && (
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-[spin_4s_linear_infinite] opacity-50 blur-xl" style={{ margin: '-20%' }} />
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          
          <div className="relative z-10 w-full h-full p-2">
            <AnimatePresence mode="wait">
              {!imagePreview ? (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full h-full border-2 border-dashed border-muted-foreground/30 rounded-[1.5rem] flex flex-col items-center justify-center p-8 text-center cursor-pointer group-hover:border-indigo-500/50 transition-colors bg-card/50"
                  role="button"
                  tabIndex={0}
                  onClick={triggerUpload}
                  onKeyDown={handleKeyDown}
                  aria-label="Upload an image for analysis"
                  data-testid="upload-dropzone"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-full flex items-center justify-center mb-8 shadow-inner border border-indigo-200 dark:border-indigo-800"
                  >
                    <UploadCloud className="w-12 h-12 text-indigo-500 drop-shadow-md" />
                  </motion.div>
                  <h3 className="text-2xl font-black mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI Vision Scanner</h3>
                  <p className="text-muted-foreground font-medium max-w-sm">
                    Upload an item or product. Gemini will analyze its carbon footprint instantly.
                  </p>
                  <Button className="mt-8 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_20px_rgba(79,70,229,0.4)] px-8 py-6 text-lg font-bold">
                    <ImageIcon className="w-5 h-5 mr-2" /> Select Image
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="w-full h-full relative rounded-[1.5rem] overflow-hidden shadow-inner"
                >
                  <Image src={imagePreview} unoptimized fill alt="Uploaded item preview" className="object-cover" />
                  
                  {/* Laser Scanning Animation */}
                  {isLoading && (
                    <>
                      <div className="absolute inset-0 bg-indigo-900/20 mix-blend-overlay" />
                      <motion.div 
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_4px_rgba(34,211,238,0.8)] z-20"
                      />
                      <motion.div 
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-32 bg-gradient-to-b from-transparent to-cyan-400/30 -translate-y-full z-10"
                      />
                    </>
                  )}

                  <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-0 hover:opacity-100'}`}>
                    <Button variant="secondary" onClick={reset} className="rounded-full shadow-2xl font-bold bg-white text-black hover:bg-gray-200">
                      <RefreshCcw className="w-4 h-4 mr-2" /> Scan Another
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Results Section - 3D Flip Container */}
        <section className="relative perspective-1000 min-h-[500px]" aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.5 }}
                data-testid="vision-loading"
                className="absolute inset-0 bg-card border rounded-[2rem] shadow-xl flex flex-col items-center justify-center text-center p-8 transform-style-3d backface-hidden"
              >
                <div className="relative mb-8">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                    <div className="w-24 h-24 rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
                  </motion.div>
                  <Zap className="w-10 h-10 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                </div>
                <h3 className="text-2xl font-black mb-2">Analyzing with Gemini...</h3>
                <p className="text-muted-foreground font-medium">Extracting materials, calculating impact, finding alternatives.</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                data-testid="vision-error"
                className="absolute inset-0 bg-card border-2 border-red-500/20 rounded-[2rem] shadow-xl flex flex-col items-center justify-center text-center p-8 transform-style-3d backface-hidden"
              >
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                  <RefreshCcw className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-red-500">Analysis Failed</h3>
                <p className="text-muted-foreground font-medium mb-6">{error}</p>
                <Button onClick={reset} variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-full px-8 py-6 font-bold">Try Again</Button>
              </motion.div>
            ) : result ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                data-testid="vision-result"
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                className="absolute inset-0 bg-card border-2 border-indigo-500/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col justify-between p-8 transform-style-3d backface-hidden overflow-y-auto"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-black uppercase tracking-wider border border-indigo-500/20 shadow-sm">
                      <ImageIcon className="w-4 h-4" /> Identified
                    </span>
                    {isLogged && (
                      <span className="inline-flex items-center gap-1 text-green-500 font-bold animate-pulse">
                        <CheckCircle2 className="w-5 h-5" /> Saved to Profile
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-4xl font-black bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-6 leading-tight">
                    {result.itemName}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border shadow-inner relative overflow-hidden group">
                      <p className="text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2">
                         Impact <Zap className="w-4 h-4 text-orange-500" />
                      </p>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-black text-foreground">{result.estimatedFootprint}</span>
                        <span className="text-sm font-bold text-muted-foreground mb-1">kg CO₂</span>
                      </div>
                      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-colors" />
                    </div>

                    <div className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/10 border border-green-500/20 shadow-inner relative overflow-hidden group">
                      <p className="text-sm font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                         Alternative <Leaf className="w-4 h-4" />
                      </p>
                      <p className="text-sm font-bold text-foreground leading-tight">
                        {result.ecoAlternative}
                      </p>
                      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-colors" />
                    </div>
                  </div>

                  {/* Material Breakdown */}
                  <div className="mb-6 space-y-3">
                    <h4 className="text-sm font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wide">
                      <PieChart className="w-4 h-4" /> Material Composition
                    </h4>
                    {result.materials.map((mat, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-sm font-semibold">
                          <span>{mat.name}</span>
                          <span>{mat.percentage}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${mat.percentage}%` }}
                            transition={{ duration: 1, delay: 0.5 + (idx * 0.2) }}
                            className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground font-medium leading-relaxed p-4 bg-muted/50 rounded-xl border border-dashed">
                    {result.details}
                  </p>
                </div>

                <div className="mt-6">
                  {!isLogged ? (
                    <Button 
                      onClick={logAction} 
                      className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-6 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all group"
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" /> Log to Impact Profile 
                      <ChevronRight className="w-5 h-5 ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full rounded-xl py-6 font-bold text-green-600 border-green-500/30 bg-green-500/5 hover:bg-green-500/10 cursor-default">
                      Saved Successfully!
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-center p-8 bg-card/30"
              >
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold mb-2">Awaiting Image</h3>
                <p className="text-muted-foreground font-medium max-w-xs">Results and detailed eco-analysis will magically appear here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </div>
    </div>
  );
}
