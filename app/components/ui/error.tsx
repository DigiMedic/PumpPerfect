import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";

interface ErrorDisplayProps {
  title?: string;
  description?: string;
  error?: Error;
  onRetry?: () => void;
}

export function ErrorDisplay({
  title = "Chyba",
  description = "Něco se pokazilo",
  error,
  onRetry
}: ErrorDisplayProps) {
  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <pre className="mt-2 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            {error.message}
          </pre>
        )}
        {onRetry && (
          <div className="mt-4 flex justify-end">
            <Button onClick={onRetry}>Zkusit znovu</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 