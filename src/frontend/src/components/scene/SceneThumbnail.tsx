import { useState } from 'react';
import { SceneType } from '../../contexts/SceneContext';
import { ImageIcon } from 'lucide-react';

interface SceneThumbnailProps {
  sceneUrl: string;
  sceneLabel: string;
  onError?: () => void;
}

/**
 * Defensive scene thumbnail component that handles image load errors gracefully
 */
export function SceneThumbnail({ sceneUrl, sceneLabel, onError }: SceneThumbnailProps) {
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  if (imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/50">
        <div className="text-center space-y-1.5">
          <ImageIcon className="h-7 w-7 mx-auto text-muted-foreground/60" />
          <p className="text-xs text-muted-foreground font-medium">{sceneLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={sceneUrl}
      alt={sceneLabel}
      className="w-full h-full object-cover"
      onError={handleError}
      loading="lazy"
    />
  );
}

