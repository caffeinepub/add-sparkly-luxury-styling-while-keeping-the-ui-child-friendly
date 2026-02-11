import { useNavigate } from '@tanstack/react-router';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { ScenePicker } from '../components/scene/ScenePicker';
import { Card } from '@/components/ui/card';
import { Sparkles, Zap, Heart, Star } from 'lucide-react';
import { useSceneBackground } from '../hooks/useSceneBackground';
import { SparkleOverlay } from '../components/common/SparkleOverlay';

export default function GamesHubScreen() {
  const navigate = useNavigate();
  const backgroundStyle = useSceneBackground();

  const girlyGames = [
    { name: 'Word Builder', path: '/games/girly/word-builder', icon: Sparkles },
    { name: 'Memory Match', path: '/games/girly/memory-match', icon: Heart },
  ];

  const boyGames = [
    { name: 'Math Bubbles', path: '/games/boy/math-bubbles', icon: Zap },
    { name: 'Shape Sort', path: '/games/boy/shape-sort', icon: Star },
  ];

  return (
    <div
      className="min-h-screen scene-bg relative"
      style={backgroundStyle}
    >
      <SparkleOverlay intensity="subtle" showCorners={false} />
      
      <div className="min-h-screen bg-background/85 backdrop-blur-sm relative z-10">
        <ScreenHeader title="Games" subtitle="Choose your adventure" />

        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5">
          <ScenePicker />

          {/* Girly Games */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Creative Games
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {girlyGames.map((game) => (
                <Card
                  key={game.path}
                  onClick={() => navigate({ to: game.path })}
                  className="luxury-card-sparkle p-5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-luxury hover:shadow-luxury-lg"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20 sparkle-icon">
                      <game.icon className="h-8 w-8 text-primary" />
                    </div>
                    <span className="font-semibold text-base text-center">{game.name}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Boy Games */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
              Action Games
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {boyGames.map((game) => (
                <Card
                  key={game.path}
                  onClick={() => navigate({ to: game.path })}
                  className="luxury-card-sparkle p-5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-luxury hover:shadow-luxury-lg"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-xl bg-secondary/10 ring-1 ring-secondary/20 sparkle-icon">
                      <game.icon className="h-8 w-8 text-secondary" />
                    </div>
                    <span className="font-semibold text-base text-center">{game.name}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
