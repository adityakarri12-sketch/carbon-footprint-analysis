'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    void(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-red-500/10 p-4 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight mb-3">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        We hit an unexpected error while rendering this page. Our team has been notified.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="bg-red-600 hover:bg-red-700 text-white">
          Try again
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Return Home
        </Button>
      </div>
    </div>
  );
}
