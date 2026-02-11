export interface QuizQuestion {
  question: string;
  answers: string[];
  correctAnswer: number;
}

export const quizQuestions: QuizQuestion[] = [
  {
    question: 'What is 5 + 3?',
    answers: ['6', '7', '8', '9'],
    correctAnswer: 2,
  },
  {
    question: 'Which color do you get when you mix blue and yellow?',
    answers: ['Green', 'Purple', 'Orange', 'Red'],
    correctAnswer: 0,
  },
  {
    question: 'How many days are in a week?',
    answers: ['5', '6', '7', '8'],
    correctAnswer: 2,
  },
  {
    question: 'What is the opposite of hot?',
    answers: ['Warm', 'Cold', 'Cool', 'Freezing'],
    correctAnswer: 1,
  },
  {
    question: 'Which animal says "meow"?',
    answers: ['Dog', 'Cat', 'Cow', 'Bird'],
    correctAnswer: 1,
  },
  {
    question: 'What comes after Monday?',
    answers: ['Sunday', 'Tuesday', 'Wednesday', 'Thursday'],
    correctAnswer: 1,
  },
  {
    question: 'How many legs does a spider have?',
    answers: ['6', '8', '10', '12'],
    correctAnswer: 1,
  },
  {
    question: 'What shape is a ball?',
    answers: ['Square', 'Triangle', 'Circle', 'Rectangle'],
    correctAnswer: 2,
  },
];
