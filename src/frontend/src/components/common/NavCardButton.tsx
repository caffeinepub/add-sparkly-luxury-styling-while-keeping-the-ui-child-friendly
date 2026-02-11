import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface NavCardButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export function NavCardButton({ icon: Icon, label, onClick }: NavCardButtonProps) {
  return (
    <Card
      onClick={onClick}
      className="luxury-card p-5 sm:p-6 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-luxury hover:shadow-luxury-lg"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="p-3 sm:p-4 rounded-xl bg-primary/10 ring-1 ring-primary/20">
          <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
        </div>
        <span className="font-semibold text-base sm:text-lg text-center">{label}</span>
      </div>
    </Card>
  );
}

