import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import WelcomeScreen from './pages/WelcomeScreen';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import HomeworkScreen from './pages/HomeworkScreen';
import TimetableScreen from './pages/TimetableScreen';
import GamesHubScreen from './pages/GamesHubScreen';
import QuizScreen from './pages/QuizScreen';
import GirlyGame1Screen from './pages/games/GirlyGame1Screen';
import GirlyGame2Screen from './pages/games/GirlyGame2Screen';
import BoyGame1Screen from './pages/games/BoyGame1Screen';
import BoyGame2Screen from './pages/games/BoyGame2Screen';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: WelcomeScreen,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginScreen,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: HomeScreen,
});

const homeworkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/homework',
  component: HomeworkScreen,
});

const timetableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/timetable',
  component: TimetableScreen,
});

const gamesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games',
  component: GamesHubScreen,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz',
  component: QuizScreen,
});

const girlyGame1Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games/girly/word-builder',
  component: GirlyGame1Screen,
});

const girlyGame2Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games/girly/memory-match',
  component: GirlyGame2Screen,
});

const boyGame1Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games/boy/math-bubbles',
  component: BoyGame1Screen,
});

const boyGame2Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games/boy/shape-sort',
  component: BoyGame2Screen,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  homeRoute,
  homeworkRoute,
  timetableRoute,
  gamesRoute,
  quizRoute,
  girlyGame1Route,
  girlyGame2Route,
  boyGame1Route,
  boyGame2Route,
]);
