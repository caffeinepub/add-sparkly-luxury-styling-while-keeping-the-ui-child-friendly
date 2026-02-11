import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SceneType = 'classroom' | 'garden' | 'library' | 'playground';

interface SceneContextType {
  selectedScene: SceneType;
  setSelectedScene: (scene: SceneType) => void;
  getSceneUrl: (scene: SceneType) => string;
}

const SceneContext = createContext<SceneContextType | undefined>(undefined);

const STORAGE_KEY = 'school-planner-selected-scene';
const DEFAULT_SCENE: SceneType = 'classroom';

// Validate that a string is a valid SceneType
function isValidScene(value: unknown): value is SceneType {
  return typeof value === 'string' && ['classroom', 'garden', 'library', 'playground'].includes(value);
}

// Load scene from localStorage with validation
function loadStoredScene(): SceneType {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidScene(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to load stored scene:', error);
  }
  return DEFAULT_SCENE;
}

// Save scene to localStorage
function saveScene(scene: SceneType): void {
  try {
    localStorage.setItem(STORAGE_KEY, scene);
  } catch (error) {
    console.warn('Failed to save scene:', error);
  }
}

export function SceneProvider({ children }: { children: ReactNode }) {
  const [selectedScene, setSelectedSceneState] = useState<SceneType>(loadStoredScene);

  const setSelectedScene = (scene: SceneType) => {
    // Validate the scene before setting
    if (!isValidScene(scene)) {
      console.warn('Invalid scene type:', scene);
      return;
    }
    
    // Only update if different to avoid unnecessary re-renders
    if (scene !== selectedScene) {
      setSelectedSceneState(scene);
      saveScene(scene);
    }
  };

  const getSceneUrl = (scene: SceneType): string => {
    return `/assets/generated/scene-${scene}.dim_1920x1080.png`;
  };

  return (
    <SceneContext.Provider value={{ selectedScene, setSelectedScene, getSceneUrl }}>
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error('useScene must be used within SceneProvider');
  }
  return context;
}
