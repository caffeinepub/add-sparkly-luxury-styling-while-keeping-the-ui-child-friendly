import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
      <div className="p-6 rounded-full bg-destructive/10">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h3 className="text-xl font-bold">Oops!</h3>
      <p className="text-muted-foreground max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="rounded-full">
          Try Again
        </Button>
      )}
    </div>
  );
}
