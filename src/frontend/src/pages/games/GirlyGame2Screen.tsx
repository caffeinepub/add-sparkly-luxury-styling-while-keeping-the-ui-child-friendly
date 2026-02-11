import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { BigActionButton } from '../../components/common/BigActionButton';
import { Card } from '@/components/ui/card';
import { Heart, RotateCcw } from 'lucide-react';
import { useSceneBackground } from '../../hooks/useSceneBackground';

const emojis = ['🌸', '🦋', '🌈', '⭐', '💖', '🎀', '🌺', '🦄'];

export default function GirlyGame2Screen() {
  const navigate = useNavigate();
  const backgroundStyle = useSceneBackground();
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    const gameCards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameStarted(true);
  };

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const isComplete = matched.length === cards.length && cards.length > 0;

  return (
    <div
      className="min-h-screen scene-bg"
      style={backgroundStyle}
    >
      <div className="min-h-screen bg-background/80 backdrop-blur-sm">
        <ScreenHeader title="Memory Match" subtitle="Find the matching pairs!" showHome />

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {!gameStarted ? (
            <Card className="p-8 shadow-cute-lg text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-6 rounded-full bg-primary/20">
                  <Heart className="h-16 w-16 text-primary fill-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Memory Match</h2>
                <p className="text-muted-foreground">
                  Flip the cards and find all the matching pairs!
                </p>
              </div>
              <BigActionButton onClick={startGame} icon={Heart} className="w-full">
                Start Game
              </BigActionButton>
            </Card>
          ) : (
            <>
              <Card className="p-6 shadow-cute-lg">
                <div className="text-center">
                  <p className="text-lg font-bold">Moves: {moves}</p>
                  {isComplete && (
                    <p className="text-2xl font-bold text-primary mt-2">
                      🎉 You won in {moves} moves! 🎉
                    </p>
                  )}
                </div>
              </Card>

              <div className="grid grid-cols-4 gap-3">
                {cards.map((emoji, index) => {
                  const isFlipped = flipped.includes(index) || matched.includes(index);
                  return (
                    <Card
                      key={index}
                      onClick={() => handleCardClick(index)}
                      className={`aspect-square flex items-center justify-center text-4xl cursor-pointer transition-all hover:scale-105 ${
                        isFlipped ? 'bg-primary/20' : 'bg-muted'
                      }`}
                    >
                      {isFlipped ? emoji : '?'}
                    </Card>
                  );
                })}
              </div>

              <BigActionButton onClick={startGame} icon={RotateCcw} className="w-full" variant="outline">
                New Game
              </BigActionButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
