import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileHeader, ProfileContainer } from '../../components/molecules';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  updateProfile,
  getUserProfile,
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

type ModalType = 'vibes' | 'scenes' | 'hobbies' | null;

const MIN_LOADING_DURATION = 2500;
const NAVIGATION_DELAY = 500;

const PreferenceSummary = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const { vibes, scenes, hobbies, selectedVibes, selectedScenes, selectedHobbies, isLoading } =
    useAppSelector((state) => state.profile);

  const { userId } = useAppSelector((state) => state.auth);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isCompletingProfile, setIsCompletingProfile] = useState(false);
  const [completionStartTime, setCompletionStartTime] = useState<number | null>(null);
  const [navigationPreparingText, setNavigationPreparingText] = useState(
    'Setting up your profile...'
  );

  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchVibes());
      dispatch(fetchScenes());
      dispatch(fetchHobbies());
    }
  }, [dispatch, userId]);

  /**
   * Direct navigation to TabNavigator using CommonActions.reset
   * This ensures a clean navigation state and prevents duplicate navigation
   */
  const navigateToMainApp = () => {
    if (hasNavigatedRef.current) {
      console.log('Navigation already executed, skipping duplicate call');
      return;
    }
    hasNavigatedRef.current = true;

    const now = Date.now();
    const timeElapsed = completionStartTime ? now - completionStartTime : 0;

    const additionalWaitTime = Math.max(0, MIN_LOADING_DURATION - timeElapsed);

    console.log(
      `Navigation preparation: ${timeElapsed}ms elapsed, waiting additional ${additionalWaitTime}ms`
    );

    setTimeout(
      () => {
        setNavigationPreparingText('Preparing your experience...');
      },
      Math.min(500, additionalWaitTime / 2)
    );

    // Set local storage flag first
    AsyncStorage.setItem('profileCompleted', 'true')
      .then(() => {
        console.log('Profile completion flag set in AsyncStorage');

        // Wait for the minimum loading duration plus a navigation delay
        setTimeout(() => {
          console.log('Executing navigation to TabNavigator (single dispatch)');

          // Reset navigation stack completely
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'TabNavigator' }],
            })
          );
          console.log('Navigation dispatch completed');
        }, additionalWaitTime + NAVIGATION_DELAY);
      })
      .catch((error) => {
        console.error('Navigation error:', error);
        Alert.alert('Error', 'Failed to navigate. Please try again.');
        setIsSavingProfile(false);
        setIsCompletingProfile(false);
        hasNavigatedRef.current = false; // Reset navigation flag on error
      });
  };

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

  // Handle item selection in modal
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
    setModalVisible(false);
  };

  // This completes the profile and navigates directly
  const completeProfileAndNavigate = async () => {
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
      const startTime = Date.now();
      setCompletionStartTime(startTime);

      // Update UI state
      setIsSavingProfile(true);
      setIsCompletingProfile(true);

      // Create update payload with profile completion flag
      const profileUpdateData = {
        vibes: selectedVibes,
        scenes: selectedScenes,
        hobbies: selectedHobbies,
        profileCompleted: true,
      };

      // Update profile on server
      console.log('Updating profile with completion data...');
      const result = await dispatch(
        updateProfile({
          userId,
          profileData: profileUpdateData,
        })
      ).unwrap();

      console.log('Profile update successful:', result);

      // Set the profileCompleted flag in AsyncStorage
      await AsyncStorage.setItem('profileCompleted', 'true');
      console.log('Profile completion flag set in storage');

      // No duplicate verification call - just navigate once
      navigateToMainApp();
    } catch (error) {
      console.error('Failed to complete profile:', error);
      Alert.alert('Error', 'Failed to complete profile. Please try again.');
      setIsSavingProfile(false);
      setIsCompletingProfile(false);
      setCompletionStartTime(null);
      hasNavigatedRef.current = false; // Reset navigation flag on error
    }
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />

      {isSavingProfile && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color="#AAD3FF" />
          <Text style={styles.savingText}>
            {isCompletingProfile ? navigationPreparingText : 'Saving your preferences...'}
          </Text>
        </View>
      )}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ProfileContainer>
          <Text style={styles.titleText}>Your Preferences</Text>
          <Text style={styles.subtitleText}>Review your selections before completing setup</Text>

          {/* Show loading indicator while preferences are being fetched */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#AAD3FF" />
              <Text style={styles.loadingText}>Loading your preferences...</Text>
            </View>
          ) : (
            <>
              {/* Vibes Section */}
              <SelectedPreferenceList
                title="Your Vibe"
                items={getSelectedItemDetails('vibes')}
                onAddPress={() => openModal('vibes')}
              />

              {/* Scenes Section */}
              <SelectedPreferenceList
                title="Your Scene"
                items={getSelectedItemDetails('scenes')}
                onAddPress={() => openModal('scenes')}
              />

              {/* Hobbies Section */}
              <SelectedPreferenceList
                title="Your Thing"
                items={getSelectedItemDetails('hobbies')}
                onAddPress={() => openModal('hobbies')}
              />

              {/* Complete Button */}
              <CrewButton
                variant="filled"
                text="Looks Good"
                color="secondary"
                size="large"
                fullWidth={true}
                onPress={completeProfileAndNavigate}
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

      {/* Selection Modal */}
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
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
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

// import React, { useState, useEffect } from 'react';
// import { View, Text, ScrollView, Alert, StyleSheet, ActivityIndicator } from 'react-native';
// import { CommonActions } from '@react-navigation/native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ProfileHeader, ProfileContainer } from '../../components/molecules';
// import { useAppDispatch, useAppSelector } from '../../store';
// import {
//   updateProfile,
//   getUserProfile,
//   fetchVibes,
//   fetchScenes,
//   fetchHobbies,
//   setSelectedVibes,
//   setSelectedScenes,
//   setSelectedHobbies,
// } from '../../store/slices/profileSlice';
// import { CrewButton } from '../../components/atoms';
// import SelectedPreferenceList from 'components/molecules/SelectedPreferenceList';
// import PreferenceSelectionModal from 'components/molecules/PreferenceSelectionModal';

// type ModalType = 'vibes' | 'scenes' | 'hobbies' | null;

// const PreferenceSummary = () => {
//   const dispatch = useAppDispatch();
//   const navigation = useNavigation();

//   const { vibes, scenes, hobbies, selectedVibes, selectedScenes, selectedHobbies, isLoading } =
//     useAppSelector((state) => state.profile);

//   const { userId } = useAppSelector((state) => state.auth);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState<ModalType>(null);
//   const [isSavingProfile, setIsSavingProfile] = useState(false);
//   const [isCompletingProfile, setIsCompletingProfile] = useState(false);

//   // Load preferences when component mounts
//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchVibes());
//       dispatch(fetchScenes());
//       dispatch(fetchHobbies());
//     }
//   }, [dispatch, userId]);

//   /**
//    * Direct navigation to TabNavigator using CommonActions.reset
//    * This ensures a clean navigation state
//    */
//   const navigateToMainApp = () => {
//     // Set local storage flag first
//     AsyncStorage.setItem('profileCompleted', 'true')
//       .then(() => {
//         console.log('Profile completion flag set in AsyncStorage');

//         // Reset navigation stack completely
//         navigation.dispatch(
//           CommonActions.reset({
//             index: 0,
//             routes: [{ name: 'TabNavigator' }],
//           })
//         );
//       })
//       .catch((error) => {
//         console.error('Navigation error:', error);
//         Alert.alert('Error', 'Failed to navigate. Please try again.');
//         setIsSavingProfile(false);
//         setIsCompletingProfile(false);
//       });
//   };

//   const getSelectedItemDetails = (type: 'vibes' | 'scenes' | 'hobbies') => {
//     const allItems = type === 'vibes' ? vibes : type === 'scenes' ? scenes : hobbies;
//     const selectedIds =
//       type === 'vibes' ? selectedVibes : type === 'scenes' ? selectedScenes : selectedHobbies;

//     return allItems
//       .filter((item) => selectedIds.includes(item._id))
//       .map((item) => ({
//         _id: item._id,
//         title: item.title,
//         imageUrl: item.imageUrl,
//       }));
//   };

//   const openModal = (type: ModalType) => {
//     setModalType(type);
//     setModalVisible(true);
//   };

//   // Handle item selection in modal
//   const handleItemToggle = (itemId: string) => {
//     if (!modalType) return;

//     if (modalType === 'vibes') {
//       const newSelection = selectedVibes.includes(itemId)
//         ? selectedVibes.filter((id) => id !== itemId)
//         : [...selectedVibes, itemId];
//       dispatch(setSelectedVibes(newSelection));
//     } else if (modalType === 'scenes') {
//       const newSelection = selectedScenes.includes(itemId)
//         ? selectedScenes.filter((id) => id !== itemId)
//         : [...selectedScenes, itemId];
//       dispatch(setSelectedScenes(newSelection));
//     } else if (modalType === 'hobbies') {
//       const newSelection = selectedHobbies.includes(itemId)
//         ? selectedHobbies.filter((id) => id !== itemId)
//         : [...selectedHobbies, itemId];
//       dispatch(setSelectedHobbies(newSelection));
//     }
//   };

//   const saveSelections = () => {
//     setModalVisible(false);
//   };

//   // This completes the profile and navigates directly
//   const completeProfileAndNavigate = async () => {
//     if (!userId) {
//       Alert.alert('Error', 'User ID not found');
//       return;
//     }

//     if (selectedVibes.length === 0 || selectedScenes.length === 0 || selectedHobbies.length === 0) {
//       Alert.alert(
//         'Incomplete Profile',
//         'Please make sure you have selected at least one vibe, scene, and hobby.'
//       );
//       return;
//     }

//     try {
//       // Update UI state
//       setIsSavingProfile(true);
//       setIsCompletingProfile(true);

//       // Create update payload with profile completion flag
//       const profileUpdateData = {
//         vibes: selectedVibes,
//         scenes: selectedScenes,
//         hobbies: selectedHobbies,
//         profileCompleted: true,
//       };

//       // Update profile on server
//       const result = await dispatch(
//         updateProfile({
//           userId,
//           profileData: profileUpdateData,
//         })
//       ).unwrap();

//       console.log('Profile completion successful:', result);

//       // Set the profileCompleted flag in AsyncStorage directly
//       await AsyncStorage.setItem('profileCompleted', 'true');

//       // Navigate to main app without additional checks
//       navigateToMainApp();
//     } catch (error) {
//       console.error('Failed to complete profile:', error);
//       Alert.alert('Error', 'Failed to complete profile. Please try again.');
//       setIsSavingProfile(false);
//       setIsCompletingProfile(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ProfileHeader />

//       {isSavingProfile && (
//         <View style={styles.savingOverlay}>
//           <ActivityIndicator size="large" color="#AAD3FF" />
//           <Text style={styles.savingText}>
//             {isCompletingProfile ? 'Setting up your profile...' : 'Saving your preferences...'}
//           </Text>
//         </View>
//       )}

//       <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
//         <ProfileContainer>
//           <Text style={styles.titleText}>Your Preferences</Text>
//           <Text style={styles.subtitleText}>Review your selections before completing setup</Text>

//           {/* Show loading indicator while preferences are being fetched */}
//           {isLoading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#AAD3FF" />
//               <Text style={styles.loadingText}>Loading your preferences...</Text>
//             </View>
//           ) : (
//             <>
//               {/* Vibes Section */}
//               <SelectedPreferenceList
//                 title="Your Vibe"
//                 items={getSelectedItemDetails('vibes')}
//                 onAddPress={() => openModal('vibes')}
//               />

//               {/* Scenes Section */}
//               <SelectedPreferenceList
//                 title="Your Scene"
//                 items={getSelectedItemDetails('scenes')}
//                 onAddPress={() => openModal('scenes')}
//               />

//               {/* Hobbies Section */}
//               <SelectedPreferenceList
//                 title="Your Thing"
//                 items={getSelectedItemDetails('hobbies')}
//                 onAddPress={() => openModal('hobbies')}
//               />

//               {/* Complete Button */}
//               <CrewButton
//                 variant="filled"
//                 text="Looks Good"
//                 color="secondary"
//                 size="large"
//                 fullWidth={true}
//                 onPress={completeProfileAndNavigate}
//                 loading={isLoading || isSavingProfile}
//                 disabled={
//                   isLoading ||
//                   isSavingProfile ||
//                   selectedVibes.length === 0 ||
//                   selectedScenes.length === 0 ||
//                   selectedHobbies.length === 0
//                 }
//                 className="mb-4 mt-6"
//               />
//             </>
//           )}
//         </ProfileContainer>
//       </ScrollView>

//       {/* Selection Modal */}
//       {modalType && (
//         <PreferenceSelectionModal
//           title={
//             modalType === 'vibes'
//               ? 'Your Vibe'
//               : modalType === 'scenes'
//                 ? 'Your Scene'
//                 : 'Your Thing'
//           }
//           visible={modalVisible}
//           items={modalType === 'vibes' ? vibes : modalType === 'scenes' ? scenes : hobbies}
//           selectedItems={
//             modalType === 'vibes'
//               ? selectedVibes
//               : modalType === 'scenes'
//                 ? selectedScenes
//                 : selectedHobbies
//           }
//           isLoading={isLoading}
//           onClose={() => setModalVisible(false)}
//           onSave={saveSelections}
//           onSelectItem={handleItemToggle}
//           preferenceType={modalType}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   savingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   savingText: {
//     marginTop: 16,
//     fontFamily: 'Cairo_500Medium',
//     fontSize: 18,
//     color: '#555',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 24,
//   },
//   titleText: {
//     fontFamily: 'Cairo_700Bold',
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#0D0F0F',
//     marginTop: 5,
//     marginBottom: 5,
//   },
//   subtitleText: {
//     fontFamily: 'Cairo_400Regular',
//     fontSize: 16,
//     color: '#777',
//     marginBottom: 20,
//   },
//   loadingContainer: {
//     height: 200,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 16,
//     fontFamily: 'Cairo_500Medium',
//     fontSize: 16,
//     color: '#555',
//   },
// });

// export default PreferenceSummary;
