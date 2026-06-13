import { CarbonCalculatorForm } from '@/components/carbon-calculator/carbon-calculator-form';
import { FootprintHistory } from '@/components/carbon-calculator/footprint-history';
import { GoalManager } from '@/components/goal-setting/goal-manager';
import { ProgressDashboard } from '@/components/progress-dashboard/progress-dashboard';
const UserButton = () => <button onClick={() => console.log('Sign out')}>Sign Out</button>;

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Manage your carbon footprint and track your sustainability goals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="group relative overflow-hidden rounded-xl border border-green-500/20 bg-card text-card-foreground shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:-translate-y-2 hover:border-green-500/50 transition-all duration-500">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 group-hover:text-green-600 transition-colors">Calculate Footprint</h2>
              <CarbonCalculatorForm />
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-xl border border-blue-500/20 bg-card text-card-foreground shadow-[0_0_15px_rgba(59,130,246,0.05)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:-translate-y-2 hover:border-blue-500/50 transition-all duration-500">
            <div className="p-6">
              <FootprintHistory />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="group rounded-xl border border-emerald-500/20 bg-card text-card-foreground shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:-translate-y-2 hover:border-emerald-500/50 transition-all duration-500">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 group-hover:text-emerald-500 transition-colors">Your Progress</h2>
              <ProgressDashboard />
            </div>
          </div>
          
          <div className="group rounded-xl border border-yellow-500/20 bg-card text-card-foreground shadow-[0_0_15px_rgba(234,179,8,0.05)] hover:shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:-translate-y-2 hover:border-yellow-500/50 transition-all duration-500">
            <div className="p-6">
              <GoalManager />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
