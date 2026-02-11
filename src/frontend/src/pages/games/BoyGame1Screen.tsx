import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { BigActionButton } from '../../components/common/BigActionButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, RotateCcw } from 'lucide-react';
import { useSceneBackground } from '../../hooks/useSceneBackground';

export default function BoyGame1Screen() {
  const navigate = useNavigate();
  const backgroundStyle = useSceneBackground();
  const [question, setQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = num1 + num2;
    
    const wrongAnswers = [
      answer + Math.floor(Math.random() * 3) + 1,
      answer - Math.floor(Math.random() * 3) - 1,
      answer + Math.floor(Math.random() * 5) + 2,
    ];
    
    const allOptions = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    setQuestion({ num1, num2, answer });
    setOptions(allOptions);
    setFeedback(null);
  };

  const startGame = () => {
    setScore(0);
    setGameStarted(true);
    generateQuestion();
  };

  const handleAnswer = (selectedAnswer: number) => {
    if (feedback) return;

    if (selectedAnswer === question.answer) {
      setFeedback('correct');
      setScore(score + 1);
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      generateQuestion();
    }, 1500);
  };

  return (
    <div
      className="min-h-screen scene-bg"
      style={backgroundStyle}
    >
      <div className="min-h-screen bg-background/80 backdrop-blur-sm">
        <ScreenHeader title="Math Bubbles" subtitle="Pop the correct answer!" showHome />

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {!gameStarted ? (
            <Card className="p-8 shadow-cute-lg text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-6 rounded-full bg-secondary/20">
                  <Zap className="h-16 w-16 text-secondary" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Math Bubbles</h2>
                <p className="text-muted-foreground">
                  Solve the math problems as fast as you can!
                </p>
              </div>
              <BigActionButton onClick={startGame} icon={Zap} className="w-full">
                Start Game
              </BigActionButton>
            </Card>
          ) : (
            <>
              <Card className="p-6 shadow-cute-lg">
                <div className="text-center space-y-4">
                  <p className="text-lg font-bold">Score: {score}</p>
                  <p className="text-5xl font-bold text-secondary">
                    {question.num1} + {question.num2} = ?
                  </p>
                  {feedback === 'correct' && (
                    <p className="text-2xl font-bold text-green-500">✓ Correct!</p>
                  )}
                  {feedback === 'wrong' && (
                    <p className="text-2xl font-bold text-red-500">✗ Try again!</p>
                  )}
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={!!feedback}
                    className="h-24 text-3xl font-bold rounded-3xl"
                    variant="outline"
                  >
                    {option}
                  </Button>
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
