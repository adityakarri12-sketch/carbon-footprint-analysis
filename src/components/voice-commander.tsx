"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Mic, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

// Speech Recognition Types
interface SpeechRecognitionEvent {
  results: { transcript: string }[][];
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

type WindowWithSpeech = Window & typeof globalThis & {
  SpeechRecognition?: { new (): SpeechRecognition };
  webkitSpeechRecognition?: { new (): SpeechRecognition };
};

export function VoiceCommander() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleCommand = useCallback((command: string) => {
    const cmd = command.toLowerCase().trim();
    
    // Exhaustive Routing Logic
    if (cmd.includes("dashboard")) {
      router.push("/dashboard");
      toast({ title: "Navigating to Dashboard" });
    } else if (cmd.includes("advisor") || cmd.includes("ai designer") || cmd.includes("planner")) {
      router.push("/advisor");
      toast({ title: "Navigating to AI Advisor" });
    } else if (cmd.includes("community") || cmd.includes("leaderboard")) {
      router.push("/community");
      toast({ title: "Navigating to Community" });
    } else if (cmd.includes("scan") || cmd.includes("vision") || cmd.includes("camera")) {
      router.push("/vision-scanner");
      toast({ title: "Navigating to Vision Scanner" });
    } else if (cmd.includes("profile") || cmd.includes("account") || cmd.includes("settings")) {
      router.push("/profile");
      toast({ title: "Navigating to Profile" });
    } else if (cmd.includes("visualization") || cmd.includes("charts") || cmd.includes("graphs") || cmd.includes("data")) {
      router.push("/visualizations");
      toast({ title: "Navigating to Visualizations" });
    } else if (cmd.includes("home") || cmd.includes("main") || cmd.includes("index")) {
      router.push("/");
      toast({ title: "Navigating to Home" });
    } else if (cmd.includes("log in") || cmd.includes("login") || cmd.includes("sign in")) {
      router.push("/sign-in");
      toast({ title: "Navigating to Sign In" });
    } else if (cmd.includes("register") || cmd.includes("sign up")) {
      router.push("/sign-up");
      toast({ title: "Navigating to Sign Up" });
    } else {
      toast({ 
        title: "Command not recognized", 
        description: `You said: "${command}". Try "Go to Profile" or "Open AI Designer"`, 
        variant: "destructive" 
      });
    }
  }, [router, toast]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const globalWindow = window as unknown as WindowWithSpeech;
      const SpeechRecognitionConstructor = globalWindow.SpeechRecognition || globalWindow.webkitSpeechRecognition;
      
      if (SpeechRecognitionConstructor && !recognitionRef.current) {
        const rec = new SpeechRecognitionConstructor();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onresult = (event: SpeechRecognitionEvent) => {
          const command = event.results[0][0].transcript;
          handleCommand(command);
          setIsListening(false);
        };

        rec.onerror = (event: SpeechRecognitionErrorEvent) => {
          void("Speech recognition error", event.error);
          setIsListening(false);
          toast({ 
            title: "Microphone Error", 
            description: "Please check your microphone permissions.", 
            variant: "destructive" 
          });
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
        setIsSupported(true);
      }
    }
  }, [handleCommand, toast]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        toast({ title: "Listening...", description: "Say a page name like 'Profile', 'AI Designer', or 'Visualizations'" });
      } catch (e) {
        void(e);
      }
    }
  };

  if (!isSupported) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
      {isListening && (
        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30" style={{ transform: 'scale(1.5)' }} />
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleListening}
        className={`h-16 w-16 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300 relative border-4 ${
          isListening 
            ? "bg-red-500 hover:bg-red-600 border-red-300 text-white" 
            : "bg-gradient-to-br from-emerald-500 to-green-700 hover:from-emerald-400 hover:to-green-600 border-green-300 dark:border-green-800 text-white hover:scale-110"
        }`}
        aria-label={isListening ? "Stop voice commands" : "Start voice commands"}
      >
        {isListening ? (
          <Waves className="w-8 h-8 animate-pulse" />
        ) : (
          <Mic className="w-8 h-8 drop-shadow-md" />
        )}
      </Button>
    </div>
  );
}
