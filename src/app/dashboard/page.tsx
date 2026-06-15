import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-400">CarbonWise</h1>
        </div>
        <p className="text-lg text-muted-foreground mt-3 max-w-3xl leading-relaxed">
          Your intelligent hub to <strong className="text-foreground border-b-2 border-green-500/30">understand</strong>, <strong className="text-foreground border-b-2 border-blue-500/30">track</strong>, and <strong className="text-foreground border-b-2 border-yellow-500/30">reduce</strong> your carbon footprint through <strong className="text-foreground border-b-2 border-emerald-500/30">simple actions</strong> and <strong className="text-foreground border-b-2 border-purple-500/30">personalized insights</strong>.
        </p>
      </div>

      <DashboardLayout />
    </div>
  );
}
