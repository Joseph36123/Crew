import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchVibes, setSelectedVibes } from '../../store/slices/profileSlice';
import PreferenceSelection from 'components/molecules/PreferenceSelection';

const VibeSelection = () => {
  const dispatch = useAppDispatch();

  const { vibes, selectedVibes, isLoading } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchVibes());
  }, [dispatch]);

  useEffect(() => {
    if (vibes.length > 0 && selectedVibes.length > 0) {
      const selectedVibeDetails = vibes.filter((vibe) => selectedVibes.includes(vibe._id));
      console.log(
        'Current Selected Vibes:',
        selectedVibeDetails.map((v) => ({
          id: v._id,
          title: v.title,
          imageUrl: v.imageUrl,
        }))
      );
      console.log('Vibe IDs for DB (will save at summary):', selectedVibes);
    }
  }, [vibes, selectedVibes]);

  const handleVibeToggle = (vibeId: string) => {
    let newSelectedVibes;

    if (selectedVibes.includes(vibeId)) {
      newSelectedVibes = selectedVibes.filter((id) => id !== vibeId);
    } else {
      newSelectedVibes = [...selectedVibes, vibeId];
    }

    dispatch(setSelectedVibes(newSelectedVibes));
  };

  const handleContinue = () => {
    console.log('Moving to SceneSelection with selected vibes:', selectedVibes);
  };

  return (
    <PreferenceSelection
      title="Describe your Vibe"
      subtitle="Select all that apply"
      items={vibes}
      selectedItems={selectedVibes}
      isLoading={isLoading}
      onSelectItem={handleVibeToggle}
      onContinue={handleContinue}
      nextScreenName="SceneSelection"
      preferenceType="vibes"
    />
  );
};

export default VibeSelection;
