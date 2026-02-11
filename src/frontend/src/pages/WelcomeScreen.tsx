import { useNavigate } from '@tanstack/react-router';
import { BigActionButton } from '../components/common/BigActionButton';
import { Sparkles } from 'lucide-react';
import { SparkleOverlay } from '../components/common/SparkleOverlay';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen luxury-gradient flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <SparkleOverlay intensity="high" showCorners={true} />
      
      <div className="max-w-lg w-full space-y-6 text-center animate-fade-in relative z-10">
        <div className="space-y-4">
          <div className="relative inline-block">
            <img
              src="/assets/generated/app-logo.dim_512x512.png"
              alt="My School Planner"
              className="w-28 h-28 mx-auto rounded-2xl shadow-luxury-xl ring-2 ring-primary/30 sparkle-glow"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground tracking-tight sparkle-text">
            My School Planner
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Your smart companion for homework, schedules, and learning adventures
          </p>
        </div>

        <div className="pt-4">
          <BigActionButton
            onClick={() => navigate({ to: '/login' })}
            icon={Sparkles}
            className="w-full max-w-sm mx-auto sparkle-button"
          >
            Get Started
          </BigActionButton>
        </div>

        <div className="pt-6 text-sm text-muted-foreground space-y-1">
          <p>Organize • Learn • Play • Achieve</p>
        </div>
      </div>
    </div>
  );
}
