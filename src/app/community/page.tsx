import { auth } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";
import { Users, TrendingUp } from "lucide-react";
import { CommunityDashboard } from "@/components/community/community-dashboard";
import { CommunityLottie } from "@/components/community/community-lottie";

export default async function CommunityPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fallback to a fake key if none provided to ensure the mock visually renders (user rule)
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_JS_API_KEY || "AIzaSyMockKeyForVisualsOnly";

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="space-y-2 flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight flex flex-wrap items-center gap-3">
              <Users className="w-8 h-8 text-green-500" />
              <span className="bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">Global Leaderboard</span>
            </h1>
            <p className="text-muted-foreground text-lg">Compare your carbon savings with the CarbonWise community.</p>
          </div>
          <CommunityLottie />
        </div>
        <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-xl border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all hover:-translate-y-1">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-700 dark:text-green-400">Total Community Savings: 42,500 kg CO₂</span>
        </div>
      </div>

      {/* Dashboard component handles its own client-side Map Provider */}
      <CommunityDashboard apiKey={mapsApiKey} />
    </div>
  );
}
