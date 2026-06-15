"use client";

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, Maximize2, Minimize2, Trash2 } from "lucide-react";

interface FootprintRecord {
  id: string;
  monthlyFootprint: number;
  annualFootprint: number;
  createdAt: string;
}

export function ProgressDashboard() {
  const [history, setHistory] = useState<FootprintRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/footprint');
      if (!response.ok) {
        throw new Error('Failed to fetch footprint history');
      }
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHistory();
     
  }, []);

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to delete all your past footprint history? This cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch('/api/footprint', { method: 'DELETE' });
      if (res.ok) {
        setHistory([]);
      }
    } catch (err) {
      console.error("Failed to delete history", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const displayHistory = isFullscreen ? history : history.slice(0, 5);
  const latestFootprint = history.length > 0 ? history[0].monthlyFootprint : 0;
  const BUDGET_LIMIT = 500;
  const budgetPercentage = Math.min((latestFootprint / BUDGET_LIMIT) * 100, 100);
  const isOverBudget = latestFootprint > BUDGET_LIMIT;

  const content = (
    <div className="flex flex-col h-full">
      {/* Carbon Budget Tracker Widget */}
      <div className="mb-6 p-4 rounded-xl border bg-card/50 shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Monthly Carbon Budget</h3>
            <p className="text-2xl font-mono font-bold mt-1">
              {latestFootprint.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">/ {BUDGET_LIMIT} kg CO₂</span>
            </p>
          </div>
          <div className={`text-sm font-bold px-3 py-1 rounded-full animate-pulse transition-all ${isOverBudget ? 'bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'}`}>
            {isOverBudget ? 'OVER BUDGET' : 'ON TRACK'}
          </div>
        </div>
        <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${isOverBudget ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-400 to-green-500'}`}
            style={{ width: `${budgetPercentage}%` }}
          />
        </div>
      </div>
      <div className="flex justify-end items-center gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchHistory} 
          disabled={loading}
          className="gap-2 transition-all hover:scale-105 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="gap-2 transition-all hover:scale-105 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          <span className="hidden sm:inline">{isFullscreen ? "Minimize" : "Full Screen"}</span>
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleClearHistory} 
          disabled={isDeleting}
          className="gap-2 transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
        >
          <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">{isDeleting ? "Deleting..." : "Clear Data"}</span>
        </Button>
      </div>

      <div className={isFullscreen ? "overflow-y-auto max-h-[70vh] border rounded-lg" : ""}>
        {loading && <p className="text-muted-foreground animate-pulse p-4 font-mono">Loading progress...</p>}
        {error && <p className="text-red-500 p-4">{error}</p>}
        {!loading && !error && (
          <Table>
            <TableHeader className={isFullscreen ? "sticky top-0 bg-card z-10 shadow-sm" : ""}>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Monthly (kg CO₂e)</TableHead>
                <TableHead className="text-right">Annual (kg CO₂e)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayHistory.length > 0 ? (
                displayHistory.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-mono text-sm">{new Date(record.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {(record.monthlyFootprint || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground font-mono">
                      {(record.annualFootprint || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No history yet. Calculate your footprint to get started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      
      {!isFullscreen && history.length > 5 && (
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">Showing last 5 entries. Click Full Screen to view all {history.length}.</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Placeholder to prevent layout collapse and screen shaking */}
      {isFullscreen && <div className="w-full h-[400px]" />}
      
      <div className={isFullscreen ? "fixed inset-0 z-[100] bg-background w-full h-full p-6 sm:p-12 overflow-y-auto animate-in fade-in zoom-in-95 duration-200" : "w-full"}>
        <div className={isFullscreen ? "max-w-4xl mx-auto h-full flex flex-col" : "w-full"}>
          {isFullscreen && (
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-emerald-500/20">
              <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-green-500">Complete Progress History</h2>
            </div>
          )}
          {content}
        </div>
      </div>
    </>
  );
}
