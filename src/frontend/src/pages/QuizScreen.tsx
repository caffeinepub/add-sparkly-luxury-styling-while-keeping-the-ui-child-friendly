import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetQuizProgress, useSaveQuizProgress } from '../hooks/useQueries';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { LoadingState } from '../components/common/LoadingState';
import { BigActionButton } from '../components/common/BigActionButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Trophy, RotateCcw, Check, X } from 'lucide-react';
import { useSceneBackground } from '../hooks/useSceneBackground';
import { ScenePicker } from '../components/scene/ScenePicker';
import { quizQuestions } from '../data/quizData';
import { SparkleOverlay } from '../components/common/SparkleOverlay';

type QuizState = 'intro' | 'playing' | 'results';

export default function QuizScreen() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: progress, isLoading } = useGetQuizProgress();
  const saveProgress = useSaveQuizProgress();
  const backgroundStyle = useSceneBackground();

  const [quizState, setQuizState] = useState<QuizState>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!identity) {
    navigate({ to: '/login' });
    return null;
  }

  const handleStart = () => {
    setQuizState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const isCorrect = answerIndex === quizQuestions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        finishQuiz(isCorrect ? score + 1 : score);
      }
    }, 1500);
  };

  const finishQuiz = async (finalScore: number) => {
    setQuizState('results');
    
    const newProgress = {
      lastScore: BigInt(finalScore),
      bestScore: BigInt(Math.max(finalScore, Number(progress?.bestScore || 0))),
      attemptsCount: BigInt(Number(progress?.attemptsCount || 0) + 1),
    };
    
    await saveProgress.mutateAsync(newProgress);
  };

  const question = quizQuestions[currentQuestion];

  return (
    <div
      className="min-h-screen scene-bg relative"
      style={backgroundStyle}
    >
      <SparkleOverlay intensity="subtle" showCorners={false} />
      
      <div className="min-h-screen bg-background/85 backdrop-blur-sm relative z-10">
        <ScreenHeader title="Quiz Time" subtitle="Test your knowledge" />

        <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">
          {quizState === 'intro' && (
            <>
              <ScenePicker />
              
              <Card className="luxury-card-sparkle p-6 sm:p-8 shadow-luxury-lg text-center space-y-5 animate-scale-in">
                <div className="flex justify-center">
                  <div className="p-5 rounded-2xl bg-primary/10 ring-2 ring-primary/20 sparkle-icon">
                    <Brain className="h-12 w-12 sm:h-14 sm:w-14 text-primary" />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2 sparkle-text">Ready for a Quiz?</h2>
                  <p className="text-muted-foreground">
                    Answer {quizQuestions.length} questions and test your knowledge
                  </p>
                </div>

                {isLoading && <LoadingState message="Loading your stats..." />}
                
                {progress && (
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 py-3">
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-bold text-primary">{progress.bestScore.toString()}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">Best Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-bold text-secondary">{progress.lastScore.toString()}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">Last Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-bold text-accent">{progress.attemptsCount.toString()}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">Attempts</p>
                    </div>
                  </div>
                )}

                <BigActionButton onClick={handleStart} icon={Brain} className="w-full max-w-sm mx-auto sparkle-button">
                  Start Quiz
                </BigActionButton>
              </Card>
            </>
          )}

          {quizState === 'playing' && question && (
            <Card className="luxury-card-sparkle p-5 sm:p-8 shadow-luxury-lg space-y-5 animate-fade-in">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-muted-foreground">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </span>
                <span className="text-primary">Score: {score}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-display font-bold text-center">{question.question}</h2>

              <div className="space-y-2.5">
                {question.answers.map((answer, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === question.correctAnswer;
                  const showCorrect = showFeedback && isCorrect;
                  const showWrong = showFeedback && isSelected && !isCorrect;

                  return (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={showFeedback}
                      className={`w-full h-auto p-4 text-base sm:text-lg rounded-xl transition-all font-medium ${
                        showCorrect
                          ? 'bg-success hover:bg-success text-success-foreground shadow-luxury'
                          : showWrong
                          ? 'bg-destructive hover:bg-destructive text-destructive-foreground shadow-luxury'
                          : ''
                      }`}
                      variant={isSelected && !showFeedback ? 'default' : 'outline'}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{answer}</span>
                        {showCorrect && <Check className="h-5 w-5 ml-2" />}
                        {showWrong && <X className="h-5 w-5 ml-2" />}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </Card>
          )}

          {quizState === 'results' && (
            <Card className="luxury-card-sparkle p-6 sm:p-8 shadow-luxury-lg text-center space-y-5 animate-scale-in">
              <div className="flex justify-center">
                <div className="p-5 rounded-2xl bg-primary/10 ring-2 ring-primary/20 sparkle-icon">
                  <Trophy className="h-12 w-12 sm:h-14 sm:w-14 text-primary" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2 sparkle-text">Quiz Complete!</h2>
                <p className="text-muted-foreground">Great job on finishing the quiz</p>
              </div>

              <div className="py-4">
                <p className="text-5xl sm:text-6xl font-bold text-primary mb-2">
                  {score}/{quizQuestions.length}
                </p>
                <p className="text-muted-foreground">
                  {score === quizQuestions.length
                    ? 'Perfect score! 🎉'
                    : score >= quizQuestions.length * 0.7
                    ? 'Excellent work! 🌟'
                    : score >= quizQuestions.length * 0.5
                    ? 'Good effort! 👍'
                    : 'Keep practicing! 💪'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <BigActionButton onClick={handleStart} icon={RotateCcw} className="flex-1 sparkle-button">
                  Try Again
                </BigActionButton>
                <BigActionButton
                  onClick={() => navigate({ to: '/home' })}
                  icon={Trophy}
                  className="flex-1"
                  variant="outline"
                >
                  Back Home
                </BigActionButton>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
