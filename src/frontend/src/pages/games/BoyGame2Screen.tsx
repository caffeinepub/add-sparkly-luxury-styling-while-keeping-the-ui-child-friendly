import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { BigActionButton } from '../../components/common/BigActionButton';
import { Card } from '@/components/ui/card';
import { Star, RotateCcw } from 'lucide-react';
import { useSceneBackground } from '../../hooks/useSceneBackground';

const shapes = [
  { name: 'Circle', emoji: '🔵', color: 'oklch(0.78 0.13 200)' },
  { name: 'Square', emoji: '🟦', color: 'oklch(0.78 0.13 200)' },
  { name: 'Triangle', emoji: '🔺', color: 'oklch(0.65 0.22 15)' },
  { name: 'Star', emoji: '⭐', color: 'oklch(0.82 0.12 50)' },
];

export default function BoyGame2Screen() {
  const navigate = useNavigate();
  const backgroundStyle = useSceneBackground();
  const [targetShape, setTargetShape] = useState(shapes[0]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startGame = () => {
    setScore(0);
    setGameStarted(true);
    setFeedback(null);
    generateNewShape();
  };

  const generateNewShape = () => {
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    setTargetShape(randomShape);
    setFeedback(null);
  };

  const handleShapeClick = (shape: typeof shapes[0]) => {
    if (feedback) return;

    if (shape.name === targetShape.name) {
      setFeedback('correct');
      setScore(score + 1);
      setTimeout(() => {
        generateNewShape();
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  return (
    <div
      className="min-h-screen scene-bg"
      style={backgroundStyle}
    >
      <div className="min-h-screen bg-background/80 backdrop-blur-sm">
        <ScreenHeader title="Shape Sort" subtitle="Click the matching shape!" showHome />

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {!gameStarted ? (
            <Card className="p-8 shadow-cute-lg text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-6 rounded-full bg-accent/20">
                  <Star className="h-16 w-16 text-accent" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Shape Sort</h2>
                <p className="text-muted-foreground">
                  Click on the shape that matches the one shown!
                </p>
              </div>
              <BigActionButton onClick={startGame} icon={Star} className="w-full">
                Start Game
              </BigActionButton>
            </Card>
          ) : (
            <>
              <Card className="p-6 shadow-cute-lg">
                <div className="text-center space-y-4">
                  <p className="text-lg font-bold">Score: {score}</p>
                  <p className="text-sm text-muted-foreground">Find the:</p>
                  <p className="text-3xl font-bold" style={{ color: targetShape.color }}>
                    {targetShape.name}
                  </p>
                  <p className="text-6xl">{targetShape.emoji}</p>
                  {feedback === 'correct' && (
                    <p className="text-2xl font-bold text-green-500">✓ Great job!</p>
                  )}
                  {feedback === 'wrong' && (
                    <p className="text-2xl font-bold text-red-500">✗ Try again!</p>
                  )}
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                {shapes.map((shape) => (
                  <Card
                    key={shape.name}
                    onClick={() => handleShapeClick(shape)}
                    className="p-8 cursor-pointer hover:scale-105 transition-all text-center shadow-cute hover:shadow-cute-lg"
                  >
                    <p className="text-6xl mb-2">{shape.emoji}</p>
                    <p className="font-bold text-lg">{shape.name}</p>
                  </Card>
                ))}
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
