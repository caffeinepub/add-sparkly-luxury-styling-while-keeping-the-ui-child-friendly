import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { BigActionButton } from '../components/common/BigActionButton';
import { LogIn, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SparkleOverlay } from '../components/common/SparkleOverlay';

export default function LoginScreen() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && loginStatus === 'success') {
      navigate({ to: '/home' });
    }
  }, [isAuthenticated, loginStatus, navigate]);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="min-h-screen luxury-gradient flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <SparkleOverlay intensity="high" showCorners={true} />
      
      <Card className="max-w-md w-full p-6 sm:p-8 space-y-6 shadow-luxury-xl luxury-card-sparkle animate-scale-in relative z-10">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <img
              src="/assets/generated/app-logo.dim_512x512.png"
              alt="My School Planner"
              className="w-20 h-20 mx-auto rounded-xl ring-2 ring-primary/30 sparkle-glow"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground sparkle-text">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your homework, schedule, and achievements
          </p>
        </div>

        <BigActionButton
          onClick={handleAuth}
          disabled={loginStatus === 'logging-in'}
          icon={loginStatus === 'logging-in' ? Loader2 : LogIn}
          className="w-full sparkle-button"
        >
          {loginStatus === 'logging-in' ? 'Signing In...' : 'Sign In'}
        </BigActionButton>

        {loginStatus === 'loginError' && (
          <p className="text-destructive text-center text-sm">
            Something went wrong. Please try again.
          </p>
        )}
      </Card>
    </div>
  );
}
