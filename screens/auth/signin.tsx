// screens/auth/signin.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/types';
import { CrewButton, TextInputField, GoBackButton } from '../../components/atoms';
import { useAppDispatch, useAppSelector } from '../../store';
import { initiateLogin, setAuthMode, clearError } from '../../store/slices/authSlice';

const { height } = Dimensions.get('window');

type SigninNavigationProp = StackNavigationProp<AuthStackParamList, 'Signin'>;

const Signin: React.FC = () => {
  const navigation = useNavigation<SigninNavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error, tempPhoneNumber, otpSent } = useAppSelector((state) => state.auth);

  const [phoneNumber, setPhoneNumber] = useState('');

  // Clear any errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Show error if present
    if (error) {
      Alert.alert('Login Error', error);
    }

    // Navigate to OTP verification if OTP was sent successfully
    if (otpSent && tempPhoneNumber) {
      console.log('OTP sent, navigating to verification with phone:', tempPhoneNumber);
      navigation.navigate('OTPVerification', { phoneNumber: tempPhoneNumber });
    }
  }, [error, otpSent, tempPhoneNumber, navigation]);

  const validatePhoneNumber = () => {
    // Make sure the phone entered is only numbers not letters
    const phoneRegex = /^[0-9]+$/;
    return phoneRegex.test(phoneNumber) && phoneNumber.length >= 9;
  };

  const handleSendCode = async () => {
    // Check if phone number is valid
    if (!validatePhoneNumber()) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }

    // Clear any previous errors
    dispatch(clearError());

    // Set auth mode explicitly
    dispatch(setAuthMode('login'));

    try {
      console.log('Initiating login for phone number:', phoneNumber);

      // Format phone number (add country code if needed)
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : phoneNumber;

      // Dispatch action to send OTP
      await dispatch(initiateLogin(formattedPhone));

      // Wait a moment for the state to update
      setTimeout(() => {
        console.log('Login successful, navigating to OTP verification');
        navigation.navigate('OTPVerification', { phoneNumber: formattedPhone });
      }, 100);
    } catch (err) {
      console.error('Failed to initiate login:', err);
      Alert.alert('Login Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-[#191919]">
        {/* Crew Logo */}
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

        {/* White Container */}
        <View className="absolute top-[30%] z-20 h-[70%] w-full rounded-t-[40px] bg-white">
          <View className="flex-1 px-5 pb-10 pt-8">
            {/* Go Back Button - Top Right */}
            <View className="absolute right-5 top-4 z-10">
              <GoBackButton onPress={() => navigation.goBack()} />
            </View>

            {/* Sign In Title - Left Aligned */}
            <Text className="mb-8 mt-10 font-cairo text-4xl font-bold text-[#0D0F0F]">Sign in</Text>

            {/* Phone Number Input */}
            <TextInputField
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              icon={require('../../assets/images/phone.png')}
            />

            {/* Send Code Button */}
            <CrewButton
              variant="filled"
              text="Send Code"
              color="secondary"
              size="large"
              onPress={handleSendCode}
              loading={isLoading}
              disabled={!validatePhoneNumber() || isLoading}
              className="mt-6"
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Signin;
