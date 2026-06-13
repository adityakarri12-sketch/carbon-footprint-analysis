"use client";

import { useState, useEffect, useCallback } from "react";
import { Goal, GoalList } from "./goal-list";
import { GoalForm } from "./goal-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GoalManager() {
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

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Set a New Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <GoalForm onGoalAdded={fetchGoals} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading goals...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            goals.length > 0 ? (
              <GoalList goals={goals} onGoalChange={fetchGoals} />
            ) : (
              <p>You haven&apos;t set any goals yet. Add one above to get started!</p>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
