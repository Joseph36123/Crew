import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/onboarding-navigator';
import { CrewButton, Checkbox, Title, Subtitle } from '../../components/atoms';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateProfile, getUserProfile } from '../../store/slices/profileSlice';

const { height } = Dimensions.get('window');

// Update the navigation type to use the OnboardingStackParamList
type TermsNavigationProp = StackNavigationProp<OnboardingStackParamList, 'TermsConditions'>;

const TermsConditionsScreen: React.FC = () => {
  const navigation = useNavigation<TermsNavigationProp>();
  const dispatch = useAppDispatch();

  // Getting user ID from auth state
  const { userId } = useAppSelector((state) => state.auth);
  const { isLoading: profileLoading } = useAppSelector((state) => state.profile);

  const [agreedTnC, setAgreedTnC] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Check if the user has already accepted terms on component mount
  useEffect(() => {
    const checkTermsAcceptance = async () => {
      if (!userId) {
        setInitialLoading(false);
        return;
      }

      try {
        // First, check AsyncStorage (for faster user experience)
        const localTermsAccepted = await AsyncStorage.getItem('termsAccepted');

        if (localTermsAccepted === 'true') {
          console.log('Terms already accepted locally');
          // Skip to notifications screen
          navigation.navigate('Notifications');
          return;
        }

        // If not in AsyncStorage, fetch user profile to check if terms accepted in DB
        console.log('Fetching user profile to check terms acceptance...');
        const response = await dispatch(getUserProfile(userId)).unwrap();

        // Determine where the profile data is located in the response
        const profileData = response?.profileData || response?.profileData?.data || {};

        if (profileData.termsAndConditionsAccepted) {
          console.log('Terms already accepted in database');
          // Save to AsyncStorage for future reference
          await AsyncStorage.setItem('termsAccepted', 'true');
          // Skip to notifications screen
          navigation.navigate('Notifications');
        }
      } catch (error) {
        console.error('Failed to check terms acceptance:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    checkTermsAcceptance();
  }, [userId, dispatch, navigation]);

  const handleContinue = async () => {
    if (!agreedTnC || !agreedPrivacy) {
      Alert.alert('Agreement Required', 'You must agree to T&C and Privacy Policy first.');
      return;
    }

    setIsLoading(true);

    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem('termsAccepted', 'true');
      console.log('Terms acceptance saved to AsyncStorage');

      // Save to database if user is logged in
      if (userId) {
        console.log('Saving terms acceptance to database for user:', userId);

        // Update profile with terms acceptance
        await dispatch(
          updateProfile({
            userId,
            profileData: {
              termsAndConditionsAccepted: true,
            },
          })
        ).unwrap();

        console.log('Terms acceptance saved to database');
      } else {
        console.warn('No user ID available, terms only saved locally');
      }

      // Navigate to the Notifications screen
      navigation.navigate('Notifications');
    } catch (error) {
      console.error('Error saving terms acceptance:', error);
      Alert.alert('Error', 'Failed to save your preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading indicator while checking existing terms acceptance
  if (initialLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#191919]">
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-[#191919]">
        <Image
          source={require('../../assets/images/logo.png')}
          style={{
            position: 'absolute',
            alignSelf: 'center',
            width: 400,
            height: 400,
            top: height * -0.085,
            zIndex: 1,
          }}
          resizeMode="contain"
        />

        <View className="absolute top-[30%] z-20 h-[70%] w-full rounded-t-[40px] bg-white">
          <View className="flex-1 items-center px-5 pb-10 pt-8">
            <Title text="Terms & Conditions" containerClassName="mb-4" />
            <Subtitle
              text="Agreement to the Terms & Conditions and the Privacy Policy is required to continue with Sign-Up."
              containerClassName="mb-8 w-[326px]"
            />
            <View className="w-full px-8">
              <Checkbox
                checked={agreedTnC}
                onPress={() => setAgreedTnC(!agreedTnC)}
                label="I agree to Terms and Conditions"
                containerClassName="mb-4"
              />
              <Checkbox
                checked={agreedPrivacy}
                onPress={() => setAgreedPrivacy(!agreedPrivacy)}
                label="I agree to Privacy Policy"
                containerClassName="mb-10"
              />
            </View>

            <CrewButton
              variant="filled"
              text="Continue"
              color="secondary"
              size="large"
              fullWidth={true}
              onPress={handleContinue}
              loading={isLoading || profileLoading}
              disabled={!agreedTnC || !agreedPrivacy || isLoading || profileLoading}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TermsConditionsScreen;
