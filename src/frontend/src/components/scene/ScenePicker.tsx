import { Card } from '@/components/ui/card';
import { useScene, SceneType } from '../../contexts/SceneContext';
import { Check } from 'lucide-react';
import { SceneThumbnail } from './SceneThumbnail';

const scenes: { type: SceneType; label: string }[] = [
  { type: 'classroom', label: 'Classroom' },
  { type: 'garden', label: 'Garden' },
  { type: 'library', label: 'Library' },
  { type: 'playground', label: 'Playground' },
];

export function ScenePicker() {
  const { selectedScene, setSelectedScene, getSceneUrl } = useScene();

  const handleSceneClick = (sceneType: SceneType) => {
    setSelectedScene(sceneType);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base sm:text-lg font-semibold text-center text-foreground">Choose Your Scene</h3>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {scenes.map((scene) => {
          const isSelected = selectedScene === scene.type;
          
          return (
            <Card
              key={scene.type}
              onClick={() => handleSceneClick(scene.type)}
              className={`relative cursor-pointer overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] luxury-card ${
                isSelected ? 'ring-2 ring-primary shadow-luxury-lg' : 'shadow-luxury'
              }`}
            >
              <div className="aspect-video relative">
                <SceneThumbnail
                  sceneUrl={getSceneUrl(scene.type)}
                  sceneLabel={scene.label}
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/15 flex items-center justify-center pointer-events-none backdrop-blur-[1px]">
                    <div className="bg-primary rounded-full p-2 shadow-luxury">
                      <Check className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-2 text-center font-semibold text-sm">{scene.label}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

