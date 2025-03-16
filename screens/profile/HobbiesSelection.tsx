import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchHobbies, setSelectedHobbies } from '../../store/slices/profileSlice';
import PreferenceSelection from 'components/molecules/PreferenceSelection';

const HobbiesSelection = () => {
  const dispatch = useAppDispatch();

  const { hobbies, selectedHobbies, isLoading } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchHobbies());
  }, [dispatch]);

  useEffect(() => {
    if (hobbies.length > 0 && selectedHobbies.length > 0) {
      const selectedHobbyDetails = hobbies.filter((hobby) => selectedHobbies.includes(hobby._id));
      console.log(
        'Current Selected Hobbies:',
        selectedHobbyDetails.map((h) => ({
          id: h._id,
          title: h.title,
          imageUrl: h.imageUrl,
        }))
      );
      console.log('Hobby IDs for DB (will save at summary):', selectedHobbies);
    }
  }, [hobbies, selectedHobbies]);

  const handleHobbyToggle = (hobbyId: string) => {
    let newSelectedHobbies;

    if (selectedHobbies.includes(hobbyId)) {
      newSelectedHobbies = selectedHobbies.filter((id) => id !== hobbyId);
    } else {
      newSelectedHobbies = [...selectedHobbies, hobbyId];
    }

    dispatch(setSelectedHobbies(newSelectedHobbies));
  };

  const handleContinue = () => {
    console.log('Moving to ProfileSummary with selected hobbies:', selectedHobbies);
  };

  return (
    <PreferenceSelection
      title="Your Thing"
      subtitle="Select all that apply"
      items={hobbies}
      selectedItems={selectedHobbies}
      isLoading={isLoading}
      onSelectItem={handleHobbyToggle}
      onContinue={handleContinue}
      nextScreenName="PreferenceSummary"
      preferenceType="hobbies"
    />
  );
};

export default HobbiesSelection;
