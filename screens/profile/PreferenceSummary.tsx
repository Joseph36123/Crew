import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileSetupStackParamList, RootStackParamList } from '../../types/types';
import { ProfileHeader, ProfileContainer } from '../../components/molecules';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  updateProfile,
  fetchVibes,
  fetchScenes,
  fetchHobbies,
  setSelectedVibes,
  setSelectedScenes,
  setSelectedHobbies,
} from '../../store/slices/profileSlice';
import { CrewButton } from '../../components/atoms';
import SelectedPreferenceList from 'components/molecules/SelectedPreferenceList';
import PreferenceSelectionModal from 'components/molecules/PreferenceSelectionModal';

type PreferenceSummaryNavigationProp = StackNavigationProp<
  ProfileSetupStackParamList,
  'PreferenceSummary'
>;

type ModalType = 'vibes' | 'scenes' | 'hobbies' | null;

/**
 * PreferenceSummary screen for reviewing and finalizing profile setup
 */
const PreferenceSummary = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const { vibes, scenes, hobbies, selectedVibes, selectedScenes, selectedHobbies, isLoading } =
    useAppSelector((state) => state.profile);

  const { userId } = useAppSelector((state) => state.auth);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchVibes());
      dispatch(fetchScenes());
      dispatch(fetchHobbies());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (vibes.length > 0 && selectedVibes.length > 0) {
      console.log('Current Selected Vibes (IDs for DB):', selectedVibes);
    }
    if (scenes.length > 0 && selectedScenes.length > 0) {
      console.log('Current Selected Scenes (IDs for DB):', selectedScenes);
    }
    if (hobbies.length > 0 && selectedHobbies.length > 0) {
      console.log('Current Selected Hobbies (IDs for DB):', selectedHobbies);
    }
  }, [vibes, scenes, hobbies, selectedVibes, selectedScenes, selectedHobbies]);

  const getSelectedItemDetails = (type: 'vibes' | 'scenes' | 'hobbies') => {
    const allItems = type === 'vibes' ? vibes : type === 'scenes' ? scenes : hobbies;
    const selectedIds =
      type === 'vibes' ? selectedVibes : type === 'scenes' ? selectedScenes : selectedHobbies;

    return allItems
      .filter((item) => selectedIds.includes(item._id))
      .map((item) => ({
        _id: item._id,
        title: item.title,
        imageUrl: item.imageUrl,
      }));
  };

  const openModal = (type: ModalType) => {
    setModalType(type);
    setModalVisible(true);
  };

  const handleItemToggle = (itemId: string) => {
    if (!modalType) return;

    if (modalType === 'vibes') {
      const newSelection = selectedVibes.includes(itemId)
        ? selectedVibes.filter((id) => id !== itemId)
        : [...selectedVibes, itemId];
      dispatch(setSelectedVibes(newSelection));
    } else if (modalType === 'scenes') {
      const newSelection = selectedScenes.includes(itemId)
        ? selectedScenes.filter((id) => id !== itemId)
        : [...selectedScenes, itemId];
      dispatch(setSelectedScenes(newSelection));
    } else if (modalType === 'hobbies') {
      const newSelection = selectedHobbies.includes(itemId)
        ? selectedHobbies.filter((id) => id !== itemId)
        : [...selectedHobbies, itemId];
      dispatch(setSelectedHobbies(newSelection));
    }
  };

  const saveSelections = () => {
    // Log the selected items before saving
    if (modalType === 'vibes') {
      console.log('Updated vibes selection (IDs for DB):', selectedVibes);
    } else if (modalType === 'scenes') {
      console.log('Updated scenes selection (IDs for DB):', selectedScenes);
    } else if (modalType === 'hobbies') {
      console.log('Updated hobbies selection (IDs for DB):', selectedHobbies);
    }

    // Close modal
    setModalVisible(false);
  };

  const handleComplete = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    if (selectedVibes.length === 0 || selectedScenes.length === 0 || selectedHobbies.length === 0) {
      Alert.alert(
        'Incomplete Profile',
        'Please make sure you have selected at least one vibe, scene, and hobby.'
      );
      return;
    }

    try {
      setIsSavingProfile(true);

      // Log all selected preferences before saving to DB
      console.log('Final selections being saved to DB:');
      console.log('Vibes:', selectedVibes);
      console.log('Scenes:', selectedScenes);
      console.log('Hobbies:', selectedHobbies);

      await dispatch(
        updateProfile({
          userId,
          profileData: {
            vibes: selectedVibes,
            scenes: selectedScenes,
            hobbies: selectedHobbies,
            profileCompleted: true,
          },
        })
      ).unwrap();

      console.log('Profile successfully completed, navigating to main app');

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'TabNavigator' }],
        })
      );
    } catch (error) {
      console.error('Failed to complete profile:', error);
      Alert.alert('Error', 'Failed to complete your profile. Please try again.');
      setIsSavingProfile(false);
    }
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />

      {isSavingProfile && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color="#AAD3FF" />
          <Text style={styles.savingText}>Completing your profile...</Text>
        </View>
      )}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ProfileContainer>
          <Text style={styles.titleText}>Your Preferences</Text>
          <Text style={styles.subtitleText}>Review your selections before completing setup</Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#AAD3FF" />
              <Text style={styles.loadingText}>Loading your preferences...</Text>
            </View>
          ) : (
            <>
              <SelectedPreferenceList
                title="Your Vibe"
                items={getSelectedItemDetails('vibes')}
                onAddPress={() => openModal('vibes')}
              />

              <SelectedPreferenceList
                title="Your Scene"
                items={getSelectedItemDetails('scenes')}
                onAddPress={() => openModal('scenes')}
              />

              <SelectedPreferenceList
                title="Your Thing"
                items={getSelectedItemDetails('hobbies')}
                onAddPress={() => openModal('hobbies')}
              />

              <CrewButton
                variant="filled"
                text="Looks Good"
                color="secondary"
                size="large"
                fullWidth={true}
                onPress={handleComplete}
                loading={isLoading || isSavingProfile}
                disabled={
                  isLoading ||
                  isSavingProfile ||
                  selectedVibes.length === 0 ||
                  selectedScenes.length === 0 ||
                  selectedHobbies.length === 0
                }
                className="mb-4 mt-6"
              />
            </>
          )}
        </ProfileContainer>
      </ScrollView>

      {modalType && (
        <PreferenceSelectionModal
          title={
            modalType === 'vibes'
              ? 'Your Vibe'
              : modalType === 'scenes'
                ? 'Your Scene'
                : 'Your Thing'
          }
          visible={modalVisible}
          items={modalType === 'vibes' ? vibes : modalType === 'scenes' ? scenes : hobbies}
          selectedItems={
            modalType === 'vibes'
              ? selectedVibes
              : modalType === 'scenes'
                ? selectedScenes
                : selectedHobbies
          }
          isLoading={isLoading}
          onClose={() => setModalVisible(false)}
          onSave={saveSelections}
          onSelectItem={handleItemToggle}
          preferenceType={modalType}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  savingText: {
    marginTop: 16,
    fontFamily: 'Cairo_500Medium',
    fontSize: 18,
    color: '#555',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  titleText: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D0F0F',
    marginTop: 5,
    marginBottom: 5,
  },
  subtitleText: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'Cairo_500Medium',
    fontSize: 16,
    color: '#555',
  },
});

export default PreferenceSummary;
