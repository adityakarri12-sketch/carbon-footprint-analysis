"use client";

import { useState, useEffect, useCallback } from "react";
import { Goal, GoalList } from "@/components/goal-setting/goal-list";
import { GoalForm } from "@/components/goal-setting/goal-form";
import { SimpleActionsLibrary } from "@/components/goal-setting/simple-actions-library";
import { CarbonCalculatorForm } from "@/components/carbon-calculator/carbon-calculator-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export function DashboardLayout() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/goals');
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      const data = await response.json();
      setGoals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGoals();
  }, [fetchGoals]);

  const completedCount = goals.filter(g => g.isCompleted).length;
  const challengeTarget = 3;
  const challengeProgress = Math.min((completedCount / challengeTarget) * 100, 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      
      {/* ROW 1, COL 1: Calculator */}
      <div className="space-y-6 flex flex-col h-full">
        <div className="group relative overflow-hidden rounded-xl border border-green-500/20 bg-card text-card-foreground shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:-translate-y-2 hover:border-green-500/50 transition-all duration-500 flex-1 flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="p-6 relative z-10 flex-1 flex flex-col">
            <h2 className="text-2xl font-bold mb-4 group-hover:text-green-600 transition-colors drop-shadow-sm">Calculate Footprint</h2>
            <div className="flex-1">
              <CarbonCalculatorForm />
            </div>
          </div>
        </div>
      </div>

      {/* ROW 1, COL 2: Goal Setting & Action Tracker (Widgets) */}
      <div className="space-y-6 flex flex-col h-full">
        <div className="group/yellow relative overflow-hidden rounded-xl border border-yellow-500/20 bg-card text-card-foreground shadow-[0_0_15px_rgba(234,179,8,0.05)] hover:shadow-[0_0_40px_rgba(234,179,8,0.3)] hover:-translate-y-2 hover:border-yellow-500/50 transition-all duration-500 flex-1 flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-tl from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover/yellow:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="p-6 relative z-10 flex-1 flex flex-col space-y-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 group-hover/yellow:text-yellow-500 transition-colors drop-shadow-sm">
              <span className="bg-yellow-500/10 text-yellow-500 p-2 rounded-lg">🎯</span> Goal Setting & Action Tracker
            </h2>
            
            {/* Gamification Widget */}
            <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/20 p-3 rounded-full">
                      <Trophy className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Weekly Action Challenge</h3>
                      <p className="text-sm text-muted-foreground">Complete {challengeTarget} simple actions to level up your eco-impact!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-indigo-500">{completedCount}</span>
                    <span className="text-muted-foreground">/{challengeTarget}</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-indigo-500/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${challengeProgress}%` }} />
                </div>
                {completedCount >= challengeTarget && (
                  <p className="text-green-500 text-sm mt-3 font-semibold text-center animate-pulse">
                    🎉 Challenge Complete! You&apos;re making a massive difference! 🎉
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Simple Actions Library */}
            <Card className="border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.05)] flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-green-500/10 text-green-500 p-2 rounded-lg">⚡</span> 
                  1-Click Simple Actions
                </CardTitle>
                <CardDescription>
                  Instantly adopt these high-impact habits to reduce your footprint today.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <SimpleActionsLibrary onGoalAdded={fetchGoals} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ROW 2: Single Horizontal Section for Custom Goal & Trackers */}
      <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        
        {/* Create Custom Goal (Independent Glow) */}
        <div className="group/blue relative overflow-hidden rounded-2xl border border-blue-500/30 bg-card text-card-foreground shadow-[0_0_15px_rgba(59,130,246,0.05)] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:-translate-y-1 hover:border-blue-500/60 transition-all duration-500 flex flex-col h-full backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-transparent opacity-0 group-hover/blue:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="p-8 relative z-10 flex-1 flex flex-col">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="p-2 rounded-lg bg-blue-500/10 text-blue-500 shadow-sm group-hover/blue:scale-110 transition-transform">🎯</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Create Custom Goal</span>
            </h2>
            <div className="flex-1">
              <GoalForm onGoalAdded={fetchGoals} />
            </div>
          </div>
        </div>

        {/* Your Action Trackers (Independent Glow) */}
        <div className="group/orange relative overflow-hidden rounded-2xl border border-orange-500/30 bg-card text-card-foreground shadow-[0_0_15px_rgba(249,115,22,0.05)] hover:shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:-translate-y-1 hover:border-orange-500/60 transition-all duration-500 flex flex-col h-full backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-bl from-orange-500/5 via-transparent to-transparent opacity-0 group-hover/orange:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="p-8 relative z-10 flex-1 flex flex-col">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="p-2 rounded-lg bg-orange-500/10 text-orange-500 shadow-sm group-hover/orange:scale-110 transition-transform">📈</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500">Your Action Trackers</span>
            </h2>
            <div className="flex-1 space-y-4">
              {loading && <p className="animate-pulse text-muted-foreground">Loading your impact goals...</p>}
              {error && <p className="text-red-500 p-4 bg-red-500/10 rounded-lg">{error}</p>}
              {!loading && !error && (
                goals.length > 0 ? (
                  <GoalList goals={goals} onGoalChange={fetchGoals} />
                ) : (
                  <div className="p-8 border border-dashed rounded-xl border-muted-foreground/30 text-center bg-card/50 backdrop-blur-sm shadow-inner">
                    <p className="text-muted-foreground font-medium">You haven&apos;t set any goals yet. Add one to get started!</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
