"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";

export interface Goal {
  id: string;
  description: string;
  targetDate: string;
  isCompleted: boolean;
}

interface GoalListProps {
  goals: Goal[];
  onGoalChange: () => void;
}

export function GoalList({ goals, onGoalChange }: GoalListProps) {
  const { toast } = useToast();

  const handleToggleComplete = async (goal: Goal) => {
    try {
      const response = await fetch(`/api/goals/${goal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCompleted: !goal.isCompleted }),
      });

      if (!response.ok) {
        throw new Error('Failed to update goal');
      }
      toast({
        title: "Goal Updated!",
      });
      onGoalChange();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }
      toast({
        title: "Goal Deleted!",
      });
      onGoalChange();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <Card key={goal.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={goal.isCompleted}
                onCheckedChange={() => handleToggleComplete(goal)}
              />
              <div>
                <p className={`font-medium ${goal.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                  {goal.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  Target: {new Date(goal.targetDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(goal.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
