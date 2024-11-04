'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <Card className="max-w-lg mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-red-500">Došlo k chybě</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={reset}>Zkusit znovu</Button>
      </CardContent>
    </Card>
  );
} 