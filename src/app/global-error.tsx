'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground text-center p-4">
          <h2 className="text-2xl font-bold mb-4">A critical error occurred!</h2>
          <Button onClick={() => reset()} variant="destructive">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
