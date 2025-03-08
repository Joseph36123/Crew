import React, { useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/types';
import { CrewButton, TextInputField, GoBackButton, Title } from '../../components/atoms';
import { useAppDispatch, useAppSelector } from '../../store';
import { initiateLogin, setAuthMode, clearError } from '../../store/slices/authSlice';

const { height } = Dimensions.get('window');

type SigninNavigationProp = StackNavigationProp<AuthStackParamList, 'Signin'>;

const Signin: React.FC = () => {
  const navigation = useNavigation<SigninNavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error, tempPhoneNumber, otpSent } = useAppSelector((state) => state.auth);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoPosition = useSharedValue(-100);
  const formOpacity = useSharedValue(0);
  const formPosition = useSharedValue(height * 0.3);

  // Check if we can go back
  useEffect(() => {
    // @ts-ignore - canGoBack exists but may not be in the type definitions
    setCanGoBack(navigation.canGoBack?.() || false);
  }, [navigation]);

  // Clear any errors when component mounts and setup animations
  useEffect(() => {
    dispatch(clearError());

    // Delayed entrance animations
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    logoPosition.value = withDelay(300, withTiming(0, { duration: 800 }));

    formOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    formPosition.value = withDelay(800, withTiming(0, { duration: 800 }));
  }, [dispatch, logoOpacity, logoPosition, formOpacity, formPosition]);

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

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoPosition.value }],
  }));

  const formStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formPosition.value }],
  }));

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

      // Navigation is handled by the useEffect that watches otpSent
    } catch (err) {
      console.error('Failed to initiate login:', err);
      Alert.alert('Login Error', 'An unexpected error occurred. Please try again.');
    }
  };

  // Safe back navigation
  const handleGoBack = () => {
    if (canGoBack) {
      navigation.goBack();
    } else {
      console.log('No screen to go back to');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <View className="flex-1 bg-[#191919]">
          {/* Animated Crew Logo */}
          <Animated.Image
            source={require('../../assets/images/logo.png')}
            className="absolute -top-[8.5%] z-10 h-[400px] w-[400px] self-center"
            style={logoStyle}
            resizeMode="contain"
          />

          {/* White Container with Animation */}
          <Animated.View
            className="absolute top-[27%] z-20 h-[73%] w-full rounded-t-[40px] bg-white"
            style={formStyle}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              className="flex-1"
              showsVerticalScrollIndicator={false}>
              <View className="flex-1 px-5 pb-10 pt-10">
                {/* Go Back Button - Top Right - Only show if we can go back */}
                {canGoBack && (
                  <View className="absolute right-5 top-4 z-10">
                    <GoBackButton onPress={handleGoBack} />
                  </View>
                )}

                {/* Sign In Title - Left Aligned using Title component */}
                <Title text="Sign in" align="left" containerClassName="mb-8" />

                {/* Phone Number Input */}
                <TextInputField
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  icon={require('../../assets/images/phone.png')}
                  containerClassName="mt-4"
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
                  className="mt-8"
                />
                <View className="mb-4 mt-2 flex-row items-center justify-center">
                  <Text className="pt-4 font-cairo text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Text
                      className="font-cairo text-sm font-bold text-primary-dark underline "
                      onPress={() => navigation.navigate('Signup')}>
                      Sign up.
                    </Text>
                  </Text>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Signin;
