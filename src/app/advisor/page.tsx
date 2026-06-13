import { auth } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { AdvisorDashboard } from "@/components/advisor/advisor-dashboard";

export default async function AdvisorPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Use the specific Maps JS API key
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_JS_API_KEY || "AIzaSyMockKeyForVisualsOnly";

  return (
    <main className="container mx-auto p-4 sm:p-8 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-500" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Eco-Planner & Local Resources</span>
          </h1>
          <p className="text-muted-foreground text-lg">Use Google AI and Maps to plan your sustainability journey.</p>
        </div>
      </div>

      <AdvisorDashboard mapsApiKey={mapsApiKey} />
    </main>
  );
}
