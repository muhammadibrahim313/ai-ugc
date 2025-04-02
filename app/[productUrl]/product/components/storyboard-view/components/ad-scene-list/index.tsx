import { AdScene, AdSceneCard } from "./components/ad-scene-card";

interface AdSceneListProps {
  scenes: AdScene[];
  onAddScene: () => void;
}

export function AdSceneList({ scenes }: AdSceneListProps) {
  return (
    <div className="space-y-8">
      {scenes.map((scene, index) => (
        <AdSceneCard key={scene.id} scene={scene} index={index} />
      ))}
    </div>
  );
}
