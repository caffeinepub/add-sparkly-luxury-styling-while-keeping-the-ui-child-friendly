import { useState, useEffect } from 'react';
import { useScene, SceneType } from '../contexts/SceneContext';

interface SceneBackgroundStyle {
  backgroundImage?: string;
  backgroundColor: string;
}

/**
 * Hook that safely resolves background styling for the selected scene.
 * Preloads the background image and provides a fallback if loading fails.
 */
export function useSceneBackground(): SceneBackgroundStyle {
  const { selectedScene, getSceneUrl } = useScene();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);

    const img = new Image();
    const url = getSceneUrl(selectedScene);

    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };

    img.onerror = () => {
      setImageLoaded(false);
      setImageError(true);
      console.warn(`Failed to load scene background: ${url}`);
    };

    img.src = url;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [selectedScene, getSceneUrl]);

  // Return fallback gradient if image failed to load
  if (imageError || !imageLoaded) {
    return {
      backgroundColor: 'oklch(0.95 0.02 340)',
    };
  }

  return {
    backgroundImage: `url(${getSceneUrl(selectedScene)})`,
    backgroundColor: 'oklch(0.95 0.02 340)',
  };
}
