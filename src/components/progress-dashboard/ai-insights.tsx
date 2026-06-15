"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Sparkles, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AiInsights() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to generate analysis.");
      }
      const data = await response.json();
      setAnalysis(DOMPurify.sanitize(data.analysis));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAnalysis();
  }, []);

  return (
    <div className="w-full relative overflow-hidden rounded-2xl border border-blue-500/30 bg-card p-6 shadow-[0_0_20px_rgba(59,130,246,0.15)] group transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-400">
            Deep AI Sustainability Analysis
          </h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchAnalysis} 
          disabled={loading}
          className="border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
        >
          <Activity className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Insights
        </Button>
      </div>

      <div className="relative z-10 prose prose-invert max-w-none">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-blue-500 font-mono tracking-widest uppercase text-sm animate-pulse">
              Synthesizing Footprint Data...
            </p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            {error}
          </div>
        ) : analysis ? (
          <div 
            className="text-muted-foreground leading-relaxed space-y-4 [&>h3]:text-white [&>h3]:font-bold [&>h3]:mt-6 [&>ul]:list-disc [&>ul]:pl-6 [&>p>strong]:text-blue-400"
            dangerouslySetInnerHTML={{ __html: analysis }} 
          />
        ) : (
          <p className="text-muted-foreground">No analysis available.</p>
        )}
      </div>
    </div>
  );
}
