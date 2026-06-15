import { auth } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";

import { AdvisorDashboard } from "@/components/advisor/advisor-dashboard";

export default async function AdvisorPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Use the specific Maps JS API key
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_JS_API_KEY || "AIzaSyMockKeyForVisualsOnly";

  return (
    <main className="w-full max-w-none px-4 sm:px-8 xl:px-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <AdvisorDashboard mapsApiKey={mapsApiKey} />
    </main>
  );
}
