import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showHome?: boolean;
}

export function ScreenHeader({ title, subtitle, showBack = true, showHome = false }: ScreenHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="luxury-surface-sparkle border-b px-4 py-3.5 sm:py-4 shadow-sm">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/home' })}
            className="rounded-xl h-10 w-10 sm:h-11 sm:w-11 shrink-0"
          >
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        )}
        {showHome && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/home' })}
            className="rounded-xl h-10 w-10 sm:h-11 sm:w-11 shrink-0"
          >
            <Home className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground truncate sparkle-text">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-muted-foreground truncate">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
