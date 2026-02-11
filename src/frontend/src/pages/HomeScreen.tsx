import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { ProfileSetupModal } from '../components/auth/ProfileSetupModal';
import { NavCardButton } from '../components/common/NavCardButton';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { BookOpen, Calendar, Gamepad2, Brain, LogOut, Heart } from 'lucide-react';
import { LoadingState } from '../components/common/LoadingState';
import { SparkleOverlay } from '../components/common/SparkleOverlay';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { identity, clear } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    navigate({ to: '/login' });
    return null;
  }

  if (profileLoading || !isFetched) {
    return (
      <div className="min-h-screen luxury-gradient">
        <LoadingState message="Loading your profile..." />
      </div>
    );
  }

  return (
    <>
      <ProfileSetupModal open={showProfileSetup} />
      
      <div className="min-h-screen luxury-gradient relative overflow-hidden">
        <SparkleOverlay intensity="medium" showCorners={false} />
        
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 relative z-10">
          {/* Header */}
          <div className="luxury-card-sparkle rounded-2xl p-4 sm:p-6 shadow-luxury-lg animate-fade-in">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground truncate sparkle-text">
                  Hello, {userProfile?.name || 'Friend'}!
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">What would you like to do today?</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="icon"
                className="rounded-xl h-11 w-11 shrink-0 shadow-sm hover:shadow-luxury transition-shadow"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <NavCardButton
              icon={BookOpen}
              label="Homework"
              onClick={() => navigate({ to: '/homework' })}
            />
            <NavCardButton
              icon={Calendar}
              label="Timetable"
              onClick={() => navigate({ to: '/timetable' })}
            />
            <NavCardButton
              icon={Gamepad2}
              label="Games"
              onClick={() => navigate({ to: '/games' })}
            />
            <NavCardButton
              icon={Brain}
              label="Quiz"
              onClick={() => navigate({ to: '/quiz' })}
            />
          </div>

          {/* Footer */}
          <div className="text-center text-xs sm:text-sm text-muted-foreground pt-6 space-y-1">
            <p>
              Built with <Heart className="inline h-3.5 w-3.5 fill-primary text-primary" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
            <p>© {new Date().getFullYear()} My School Planner</p>
          </div>
        </div>
      </div>
    </>
  );
}
