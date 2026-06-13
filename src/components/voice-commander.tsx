"use client";

import { useState, useEffect, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export function VoiceCommander() {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onresult = (event: any) => {
          const command = event.results[0][0].transcript.toLowerCase();
          handleCommand(command);
          setIsListening(false);
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        setRecognition(rec);
      }
    }
  }, []);

  const handleCommand = useCallback((command: string) => {
    if (command.includes("dashboard")) {
      router.push("/dashboard");
      toast({ title: "Navigating to Dashboard" });
    } else if (command.includes("calculate") || command.includes("calculator")) {
      router.push("/calculator");
      toast({ title: "Navigating to Calculator" });
    } else if (command.includes("community") || command.includes("leaderboard")) {
      router.push("/community");
      toast({ title: "Navigating to Community" });
    } else if (command.includes("scan") || command.includes("vision")) {
      router.push("/vision-scanner");
      toast({ title: "Navigating to Vision Scanner" });
    } else {
      toast({ 
        title: "Command not recognized", 
        description: `You said: "${command}". Try "Go to Dashboard"`, 
        variant: "destructive" 
      });
    }
  }, [router, toast]);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      try {
        recognition?.start();
        setIsListening(true);
        toast({ title: "Listening...", description: "Say 'Dashboard', 'Calculator', or 'Community'" });
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!recognition) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleListening}
      className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-all ${
        isListening ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" : "bg-emerald-600 hover:bg-emerald-700 text-white"
      } z-50`}
      aria-label={isListening ? "Stop voice commands" : "Start voice commands"}
    >
      {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
    </Button>
  );
}
