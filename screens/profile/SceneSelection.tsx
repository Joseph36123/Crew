import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchScenes, setSelectedScenes } from '../../store/slices/profileSlice';
import PreferenceSelection from 'components/molecules/PreferenceSelection';

const SceneSelection = () => {
  const dispatch = useAppDispatch();

  const { scenes, selectedScenes, isLoading } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchScenes());
  }, [dispatch]);

  useEffect(() => {
    if (scenes.length > 0 && selectedScenes.length > 0) {
      const selectedSceneDetails = scenes.filter((scene) => selectedScenes.includes(scene._id));
      console.log(
        'Current Selected Scenes:',
        selectedSceneDetails.map((s) => ({
          id: s._id,
          title: s.title,
          imageUrl: s.imageUrl,
        }))
      );
      console.log('Scene IDs for DB (will save at summary):', selectedScenes);
    }
  }, [scenes, selectedScenes]);

  const handleSceneToggle = (sceneId: string) => {
    let newSelectedScenes;

    if (selectedScenes.includes(sceneId)) {
      newSelectedScenes = selectedScenes.filter((id) => id !== sceneId);
    } else {
      newSelectedScenes = [...selectedScenes, sceneId];
    }

    dispatch(setSelectedScenes(newSelectedScenes));
  };

  const handleContinue = () => {
    console.log('Moving to HobbiesSelection with selected scenes:', selectedScenes);
  };

  return (
    <PreferenceSelection
      title="Your Scene"
      subtitle="Select all that apply"
      items={scenes}
      selectedItems={selectedScenes}
      isLoading={isLoading}
      onSelectItem={handleSceneToggle}
      onContinue={handleContinue}
      nextScreenName="HobbiesSelection"
      preferenceType="scenes"
    />
  );
};

export default SceneSelection;
