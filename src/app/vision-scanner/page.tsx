import { auth } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";
import { Camera, Sparkles } from "lucide-react";
import { VisionScanner } from "@/components/vision/vision-scanner";

export default async function VisionScannerPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="container mx-auto p-4 sm:p-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Camera className="w-8 h-8 text-indigo-500" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">AI Vision Scanner</span>
            <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-md uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> New
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Upload a photo of an item, meal, or appliance. Our Multi-Modal Gemini 2.5 Flash AI will identify it and instantly estimate its carbon footprint.
          </p>
        </div>
      </div>

      <VisionScanner />

    </main>
  );
}
