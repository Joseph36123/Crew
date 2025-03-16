import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CrewButton, GenderButton, InfoContainer } from '../../components/atoms';
import { ProfileHeader, ProfileContainer } from '../../components/molecules';
import Slider from '@react-native-community/slider';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateProfile, getUserProfile } from '../../store/slices/profileSlice';
import { ProfileSetupStackParamList } from 'types/types';

type ProfileBasicInfoNavigationProp = StackNavigationProp<
  ProfileSetupStackParamList,
  'ProfileBasicInfo'
>;

const ProfileBasicInfo = () => {
  const navigation = useNavigation<ProfileBasicInfoNavigationProp>();
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector((state) => state.auth);
  const { isLoading, profileData } = useAppSelector((state) => state.profile);

  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'other' | null>(null);
  const [age, setAge] = useState<number>(25);
  const [hometown, setHometown] = useState<string>('');
  const [school, setSchool] = useState<string>('');
  const [culture, setCulture] = useState<string>('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      if (!userId) {
        setInitialLoading(false);
        return;
      }

      try {
        console.log('Fetching user profile data...');
        const response = await dispatch(getUserProfile(userId)).unwrap();
        console.log('Profile data fetched:', response);

        if (!isMounted) return;

        // Determine where the profile data is located in the response
        const data = response?.profileData || response?.profileData?.data || {};
        console.log('Extracted profile data for autofill:', data);

        if (data) {
          let allFieldsFilled = true;

          if (data.gender) {
            console.log('Setting gender to:', data.gender);
            setSelectedGender(data.gender as 'male' | 'female' | 'other');
          } else {
            allFieldsFilled = false;
          }

          // First try to use the age directly
          if (data.age) {
            console.log('Setting age to:', data.age);
            setAge(Number(data.age));
          }
          // If no age, try to calculate from dateOfBirth
          else if (data.dateOfBirth) {
            console.log('Calculating age from:', data.dateOfBirth);
            const birthDate = new Date(data.dateOfBirth);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              calculatedAge--;
            }

            console.log('Calculated age:', calculatedAge);
            setAge(calculatedAge);
          } else {
            allFieldsFilled = false;
          }

          if (data.hometown) {
            console.log('Setting hometown to:', data.hometown);
            setHometown(data.hometown);
          } else {
            allFieldsFilled = false;
          }

          if (data.school) {
            console.log('Setting school to:', data.school);
            setSchool(data.school);
          } else {
            allFieldsFilled = false;
          }

          if (data.culture) {
            console.log('Setting culture to:', data.culture);
            setCulture(data.culture);
          } else {
            allFieldsFilled = false;
          }

          setTimeout(() => {
            if (isMounted) {
              setInitialLoading(false);

              if (allFieldsFilled) {
                console.log('All profile basic info already filled, navigating to photo screen');
                navigation.navigate('ProfilePhoto');
              }
            }
          }, 500);
        } else {
          if (isMounted) setInitialLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        if (isMounted) setInitialLoading(false);
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, [userId, dispatch, navigation]);

  const handleContinue = async () => {
    // Validate required fields
    if (!selectedGender) {
      Alert.alert('Required Field', 'Please select your gender to continue');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    try {
      const today = new Date();
      const birthYear = today.getFullYear() - age;
      const dateOfBirth = new Date(birthYear, today.getMonth(), today.getDate()).toISOString();

      await dispatch(
        updateProfile({
          userId,
          profileData: {
            gender: selectedGender,
            dateOfBirth,
            age: age, // Explicitly include age parameter
            school,
            culture,
            hometown,
          },
        })
      ).unwrap();

      // Navigate to the photo upload screen
      navigation.navigate('ProfilePhoto');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to save your profile information. Please try again.');
    }
  };

  // If still in initial loading state, show a loading indicator
  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#AAD3FF" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  // Check if all fields are filled
  const areAllFieldsFilled = selectedGender && age >= 18 && hometown && school && culture;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ProfileHeader />

        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            keyboardVisible && Platform.OS === 'ios' ? { paddingBottom: 280 } : {},
          ]}>
          <ProfileContainer>
            {/* Title and Subtitle */}
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Let's get you connected</Text>
              <Text style={styles.subtitleText}>Tell us about yourself</Text>
            </View>

            {/* Gender Selection */}
            <InfoContainer>
              <GenderButton
                gender="male"
                selectedGender={selectedGender}
                onSelect={setSelectedGender}
                iconSource={require('../../assets/images/male.png')}
              />
              <GenderButton
                gender="other"
                selectedGender={selectedGender}
                onSelect={setSelectedGender}
                iconSource={require('../../assets/images/nonbinary.png')}
              />
              <GenderButton
                gender="female"
                selectedGender={selectedGender}
                onSelect={setSelectedGender}
                iconSource={require('../../assets/images/female.png')}
              />
            </InfoContainer>

            {/* Age Slider */}
            <InfoContainer height={63}>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={18}
                  maximumValue={100}
                  value={age}
                  onValueChange={(value) => setAge(Math.round(value))}
                  minimumTrackTintColor="#AAD3FF"
                  maximumTrackTintColor="#EEEEEE"
                  thumbTintColor="#AAD3FF"
                  step={1}
                />
                <View style={styles.ageIndicator}>
                  <Text style={styles.ageText}>{age} Y/O</Text>
                </View>
              </View>
            </InfoContainer>

            {/* Text Input Fields - Editable */}
            <InfoContainer height={63}>
              <TextInput
                style={styles.infoInput}
                placeholder="HOMETOWN"
                placeholderTextColor="#555"
                value={hometown}
                onChangeText={setHometown}
              />
            </InfoContainer>

            <InfoContainer height={63}>
              <TextInput
                style={styles.infoInput}
                placeholder="SCHOOL"
                placeholderTextColor="#555"
                value={school}
                onChangeText={setSchool}
              />
            </InfoContainer>

            <InfoContainer height={63}>
              <TextInput
                style={styles.infoInput}
                placeholder="CULTURE"
                placeholderTextColor="#555"
                value={culture}
                onChangeText={setCulture}
              />
            </InfoContainer>

            {/* Continue Button */}
            <View style={styles.buttonContainer}>
              <CrewButton
                variant="filled"
                text="Continue"
                color="secondary"
                size="large"
                fullWidth={true}
                onPress={handleContinue}
                loading={isLoading}
                disabled={!selectedGender || isLoading}
              />
            </View>
          </ProfileContainer>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'Cairo_500Medium',
    fontSize: 16,
    color: '#555',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40, // Add bottom padding to avoid content being hidden by keyboard
  },
  titleContainer: {
    marginBottom: 24,
  },
  sliderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slider: {
    flex: 0.85,
    height: 40,
  },
  ageIndicator: {
    width: 65,
    height: 24,
    backgroundColor: '#AAD3FF',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  ageText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Cairo_500Medium',
    fontSize: 12,
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
    marginBottom: 24,
  },
  infoInput: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    width: '100%',
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
});

export default ProfileBasicInfo;
