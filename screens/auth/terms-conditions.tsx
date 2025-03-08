import React, { useState } from 'react';
import { View, Image, Dimensions, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/onboarding-navigator';
import { CrewButton, Checkbox, Title, Subtitle } from '../../components/atoms';
import { useAppDispatch, useAppSelector } from '../../store';

const { height } = Dimensions.get('window');

// Update the navigation type to use the OnboardingStackParamList
type TermsNavigationProp = StackNavigationProp<OnboardingStackParamList, 'TermsConditions'>;

const TermsConditionsScreen: React.FC = () => {
  const navigation = useNavigation<TermsNavigationProp>();
  const dispatch = useAppDispatch();

  // Getting user ID from auth state
  const { userId } = useAppSelector((state) => state.auth);

  const [agreedTnC, setAgreedTnC] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!agreedTnC || !agreedPrivacy) {
      Alert.alert('Agreement Required', 'You must agree to T&C and Privacy Policy first.');
      return;
    }

    setIsLoading(true);

    try {
      // Save that user has accepted terms to AsyncStorage
      await AsyncStorage.setItem('termsAccepted', 'true');
      console.log('Terms acceptance saved to AsyncStorage');

      // Navigate to the Notifications screen in the same navigator context
      navigation.navigate('Notifications');
    } catch (error) {
      console.error('Error saving terms acceptance:', error);
      Alert.alert('Error', 'Failed to save your preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
              loading={isLoading}
              disabled={!agreedTnC || !agreedPrivacy || isLoading}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TermsConditionsScreen;
