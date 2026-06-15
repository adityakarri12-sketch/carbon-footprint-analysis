
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const GLOW_COLORS = [
  "hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:border-green-500/50", // Green
  "hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-500/50", // Blue
  "hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:border-yellow-500/50", // Yellow
  "hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:border-purple-500/50", // Purple
  "hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:border-red-500/50", // Red
  "hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:border-pink-500/50", // Pink
];

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
        title: goal.isCompleted ? "Goal Unmarked" : "Goal Achieved! 🎉",
        description: goal.isCompleted ? "" : "Great job making a positive impact!",
      });
      onGoalChange();
    } catch {
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
        title: "Goal Deleted",
      });
      onGoalChange();
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 relative">
      <AnimatePresence>
        {goals.map((goal, index) => {
          const glowClass = GLOW_COLORS[index % GLOW_COLORS.length];
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 24 }}
            >
              <Card className={`group relative overflow-hidden transition-all duration-500 border border-border/50 ${glowClass}`}>
                <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${goal.isCompleted ? 'from-green-400 to-green-600' : 'from-muted to-muted-foreground/30'} transition-all`} />
                <CardContent className="flex items-center justify-between p-4 pl-5">
                  <div className="flex items-center space-x-4 flex-1">
                    <Checkbox
                      checked={goal.isCompleted}
                      onCheckedChange={() => handleToggleComplete(goal)}
                      aria-label={`Mark goal "${goal.description}" as ${goal.isCompleted ? 'incomplete' : 'complete'}`}
                      className="w-5 h-5 rounded-full border-2 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    />
                    <div className="flex-1">
                      <p className={`font-semibold transition-all duration-300 ${goal.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground group-hover:translate-x-1'}`}>
                        {goal.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 opacity-70">
                        <Target className="w-3 h-3" />
                        <p className="text-xs font-medium">
                          {new Date(goal.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(goal.id)} 
                    aria-label={`Delete goal: ${goal.description}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
