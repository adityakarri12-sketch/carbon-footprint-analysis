import { FootprintHistory } from '@/components/carbon-calculator/footprint-history';
import { ProgressDashboard } from '@/components/progress-dashboard/progress-dashboard';

export default function VisualizationsPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">Visualizations</h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-3xl leading-relaxed">
          Explore your historical data and progress over time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="group rounded-xl border border-blue-500/20 bg-card text-card-foreground shadow-[0_0_15px_rgba(59,130,246,0.05)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:-translate-y-2 hover:border-blue-500/50 transition-all duration-500">
          <div className="p-6">
            <FootprintHistory />
          </div>
        </div>
        
        <div className="group rounded-xl border border-emerald-500/20 bg-card text-card-foreground shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:-translate-y-2 hover:border-emerald-500/50 transition-all duration-500">
          <div className="p-6">
            <ProgressDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}
