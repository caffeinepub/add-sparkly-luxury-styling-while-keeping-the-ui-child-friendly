import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { BigActionButton } from '../../components/common/BigActionButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useSceneBackground } from '../../hooks/useSceneBackground';

const words = ['CAT', 'DOG', 'SUN', 'STAR', 'MOON', 'LOVE', 'PLAY', 'BOOK'];
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function GirlyGame1Screen() {
  const navigate = useNavigate();
  const backgroundStyle = useSceneBackground();
  const [targetWord, setTargetWord] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setTargetWord(randomWord);
    setCurrentWord('');
    setScore(0);
    setGameStarted(true);
  };

  const handleLetterClick = (letter: string) => {
    if (currentWord.length < targetWord.length) {
      const newWord = currentWord + letter;
      setCurrentWord(newWord);

      if (newWord === targetWord) {
        setScore(score + 1);
        setTimeout(() => {
          const randomWord = words[Math.floor(Math.random() * words.length)];
          setTargetWord(randomWord);
          setCurrentWord('');
        }, 1000);
      }
    }
  };

  const handleClear = () => {
    setCurrentWord('');
  };

  return (
    <div
      className="min-h-screen scene-bg"
      style={backgroundStyle}
    >
      <div className="min-h-screen bg-background/80 backdrop-blur-sm">
        <ScreenHeader title="Word Builder" subtitle="Spell the word!" showHome />

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {!gameStarted ? (
            <Card className="p-8 shadow-cute-lg text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-6 rounded-full bg-primary/20">
                  <Sparkles className="h-16 w-16 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Word Builder</h2>
                <p className="text-muted-foreground">
                  Look at the word and spell it by clicking the letters!
                </p>
              </div>
              <BigActionButton onClick={startGame} icon={Sparkles} className="w-full">
                Start Game
              </BigActionButton>
            </Card>
          ) : (
            <>
              <Card className="p-6 shadow-cute-lg">
                <div className="text-center space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Score: {score}</span>
                    <Button onClick={handleClear} variant="outline" size="sm" className="rounded-full">
                      Clear
                    </Button>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Spell this word:</p>
                    <p className="text-4xl font-bold text-primary mb-4">{targetWord}</p>
                  </div>
                  <div className="min-h-16 flex items-center justify-center">
                    <p className="text-3xl font-bold tracking-widest">
                      {currentWord || '_'.repeat(targetWord.length)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-cute-lg">
                <div className="grid grid-cols-7 gap-2">
                  {letters.map((letter) => (
                    <Button
                      key={letter}
                      onClick={() => handleLetterClick(letter)}
                      className="h-12 text-lg font-bold rounded-xl"
                      variant="outline"
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
              </Card>

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
