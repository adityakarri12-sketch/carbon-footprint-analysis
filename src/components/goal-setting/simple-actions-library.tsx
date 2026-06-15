"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Leaf, Zap, Bike, ShoppingBag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PRESET_ACTIONS = [
  {
    id: "meatless-monday",
    title: "Meatless Monday",
    description: "Skip meat one day a week to reduce agricultural emissions.",
    deepTip: "Did you know? Producing 1kg of beef emits 60kg of greenhouse gases! Skipping meat for one day a week can save over 100kg of CO2 per year.",
    icon: Leaf,
    impact: "High",
    color: "text-green-500",
    bg: "bg-green-500/10",
    glow: "shadow-[0_0_30px_rgba(34,197,94,0.3)] border-green-500/50"
  },
  {
    id: "led-bulbs",
    title: "Switch to LEDs",
    description: "Replace 5 most-used bulbs with LEDs.",
    deepTip: "LEDs use up to 90% less energy than incandescent bulbs and last 25 times longer. This is the fastest way to drop your power bill and footprint.",
    icon: Zap,
    impact: "Medium",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    glow: "shadow-[0_0_30px_rgba(234,179,8,0.3)] border-yellow-500/50"
  },
  {
    id: "active-commute",
    title: "Bike to Work",
    description: "Commute via active transport once a week.",
    deepTip: "Cars are the largest source of transport emissions. Biking just 5km to work once a week saves about 100kg of CO2 over a year. Plus, it's great exercise!",
    icon: Bike,
    impact: "High",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)] border-blue-500/50"
  },
  {
    id: "reusable-bags",
    title: "Reusable Bags",
    description: "Always bring your own bags for shopping.",
    deepTip: "Plastic bags take 500 years to degrade. Using canvas bags reduces plastic waste and the fossil fuels required to manufacture single-use plastics.",
    icon: ShoppingBag,
    impact: "Low",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.3)] border-emerald-500/50"
  },
];

interface Props {
  onGoalAdded: () => void;
}

export function SimpleActionsLibrary({ onGoalAdded }: Props) {
  const { toast } = useToast();
  const [adoptingId, setAdoptingId] = useState<string | null>(null);

  const adoptAction = async (action: typeof PRESET_ACTIONS[0]) => {
    setAdoptingId(action.id);
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: `${action.title}: ${action.description}`,
          // eslint-disable-next-line react-hooks/purity
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to adopt action');
      }

      toast({
        title: "Action Adopted! 🌍",
        description: `You've committed to: ${action.title}`,
      });
      onGoalAdded();
    } catch {
      toast({
        title: "Error",
        description: "Could not adopt action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAdoptingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      {PRESET_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <div 
            key={action.id} 
            className="group perspective-[1000px] w-full h-[220px] cursor-pointer"
          >
            <div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col items-center justify-center rounded-2xl bg-card border shadow-sm transition-colors group-hover:bg-muted/50 p-6 text-center">
                <div className={`p-4 rounded-full ${action.bg} mb-4`}>
                  <Icon className={`w-10 h-10 ${action.color}`} />
                </div>
                <h3 className="font-extrabold text-xl mb-1">{action.title}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-full bg-background border shadow-sm uppercase tracking-wider ${action.color}`}>
                  {action.impact} Impact
                </span>
                <p className="text-xs text-muted-foreground mt-4 animate-pulse">Hover to reveal insights...</p>
              </div>

              {/* BACK OF CARD (GLOW & FLIP) */}
              <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between p-6 rounded-2xl bg-card border ${action.glow}`}>
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Icon className={`w-32 h-32 ${action.color}`} />
                </div>
                
                <div className="relative z-10">
                  <h3 className="font-bold flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${action.color}`} /> Eco-Tip
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {action.deepTip}
                  </p>
                </div>
                
                <div className="relative z-10 mt-auto pt-4">
                  <Button 
                    size="sm" 
                    onClick={() => adoptAction(action)}
                    disabled={adoptingId === action.id}
                    className={`w-full gap-2 transition-all hover:-translate-y-1 ${action.color.replace('text-', 'bg-').replace('-500', '-600')} text-white hover:${action.color.replace('text-', 'bg-').replace('-500', '-700')} shadow-lg`}
                  >
                    {adoptingId === action.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <PlusCircle className="w-4 h-4" />
                    )}
                    1-Click Adopt
                  </Button>
                </div>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}
