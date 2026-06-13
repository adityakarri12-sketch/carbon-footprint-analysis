"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Image as ImageIcon, Loader2, Leaf, Zap, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalysisResult {
  itemName: string;
  estimatedFootprint: number;
  ecoAlternative: string;
  details: string;
}

export function VisionScanner() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset previous
    setResult(null);
    setImagePreview(null);

    // Create a preview
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
      // Extract the actual base64 data (remove the 'data:image/jpeg;base64,' prefix)
      const base64Image = base64Url.split(",")[1];
      
      const response = await fetch('/api/gemini/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image, mimeType })
      });

      if (!response.ok) throw new Error("Failed to process image");

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({
        itemName: "Error Analyzing Image",
        estimatedFootprint: 0,
        ecoAlternative: "Please try uploading a clearer photo.",
        details: "Our AI encountered a network or processing error."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const reset = () => {
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      <div aria-live="polite" className="sr-only">
        {isLoading ? "Analyzing image with Gemini Vision AI..." : result ? `Analysis complete. Object identified as ${result.itemName}.` : "Upload an image to begin."}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Upload Section */}
        <section className="bg-card border rounded-3xl shadow-sm overflow-hidden flex flex-col items-center justify-center min-h-[400px] relative">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
            aria-label="Upload image for analysis"
          />
          
          <AnimatePresence mode="wait">
            {!imagePreview ? (
              <motion.div 
                key="upload"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="flex flex-col items-center p-8 text-center cursor-pointer group"
                onClick={triggerUpload}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') triggerUpload() }}
              >
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-10 h-10 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Upload an Image</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Upload a photo of your meal, appliance, or vehicle to get an instant AI carbon analysis.
                </p>
                <Button variant="outline" className="mt-6 rounded-full focus-visible:ring-2 focus-visible:ring-indigo-500">Select File</Button>
              </motion.div>
            ) : (
              <motion.div 
                key="preview"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="w-full h-full relative"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Uploaded item" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button variant="secondary" onClick={reset} className="rounded-full shadow-lg">
                    <RefreshCcw className="w-4 h-4 mr-2" /> Scan Another
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Results Section */}
        <section className="bg-card border rounded-3xl shadow-sm p-6 sm:p-8 flex flex-col justify-center relative overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4 h-full">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <Zap className="w-5 h-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-lg">Gemini Vision is analyzing...</p>
                <p className="text-sm text-muted-foreground">Identifying object and calculating CO2 footprint</p>
              </div>
            </div>
          ) : result ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6 h-full flex flex-col justify-center"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <ImageIcon className="w-3.5 h-3.5" /> Object Identified
                </span>
                <h3 className="text-3xl font-black bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                  {result.itemName}
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-muted/50 border relative overflow-hidden">
                <p className="text-sm font-semibold text-muted-foreground mb-1">Estimated Footprint</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-extrabold">{result.estimatedFootprint}</span>
                  <span className="text-lg text-muted-foreground font-medium mb-1">kg CO₂e</span>
                </div>
                <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-indigo-500/5 rotate-12" />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-green-500" /> Eco Alternative
                </p>
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-800 dark:text-green-300">
                  {result.ecoAlternative}
                </div>
              </div>

              <p className="text-xs text-muted-foreground italic leading-relaxed pt-2 border-t">
                {result.details}
              </p>

            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-4 h-full text-muted-foreground/60">
              <ImageIcon className="w-16 h-16 opacity-50" />
              <p className="max-w-xs">Upload an image on the left to see Gemini&apos;s analysis appear here.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
