import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface BigActionButtonProps {
  onClick?: () => void;
  icon?: LucideIcon;
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
  disabled?: boolean;
  className?: string;
}

export function BigActionButton({
  onClick,
  icon: Icon,
  children,
  variant = 'default',
  disabled = false,
  className = '',
}: BigActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      className={`h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold rounded-xl shadow-luxury hover:shadow-luxury-lg transition-all ${className}`}
    >
      {Icon && <Icon className="mr-2.5 h-5 w-5 sm:h-6 sm:w-6" />}
      {children}
    </Button>
  );
}

