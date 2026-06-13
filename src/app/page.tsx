import { Button } from '@/components/ui/button';
const UserButton = () => <button onClick={() => console.log('Sign out')}>Sign Out</button>;
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-50 via-background to-background dark:from-green-950/20 dark:via-background dark:to-background">
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center relative z-10">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 mb-6 animate-fade-in-up">
          🌿 Your Personal Carbon Tracking Assistant
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
          Welcome to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">
            CarbonWise
          </span>
        </h1>

        <p className="mt-6 text-xl sm:text-2xl text-muted-foreground max-w-2xl">
          Track, understand, and reduce your environmental footprint with AI-driven insights and interactive goal setting.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20 transition-all hover:shadow-green-500/40 hover:-translate-y-1 text-lg px-8 h-14">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          {!userId && (
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg hover:-translate-y-1 transition-all">
              <Link href="/sign-up">Create Free Account</Link>
            </Button>
          )}
        </div>
      </main>
      
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
