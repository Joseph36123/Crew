import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
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
import type { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/types';
import { CrewButton, TextInputField, Title, GoBackButton } from '../../components/atoms';
import PhoneInputField from '../../components/atoms/PhoneInputField';
import { useAppDispatch, useAppSelector } from '../../store';
import { initiateRegister, setAuthMode, clearError } from '../../store/slices/authSlice';

const { height } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const Signup = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error, tempPhoneNumber, otpSent } = useAppSelector((state) => state.auth);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [registrationAttempted, setRegistrationAttempted] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoPosition = useSharedValue(-100);
  const formOpacity = useSharedValue(0);
  const formPosition = useSharedValue(height * 0.3);

  useEffect(() => {
    setCanGoBack(navigation.canGoBack?.() || false);
  }, [navigation]);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());

    // Delayed entrance animations
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    logoPosition.value = withDelay(300, withTiming(0, { duration: 800 }));

    formOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    formPosition.value = withDelay(800, withTiming(0, { duration: 800 }));
  }, [dispatch, logoOpacity, logoPosition, formOpacity, formPosition]);

  useEffect(() => {
    // Show error if present and registration was attempted
    if (error && registrationAttempted) {
      Alert.alert(
        'Registration Error',
        error || 'There was a problem with your registration. Please try again.'
      );
      // Reset registration attempt flag after showing error
      setRegistrationAttempted(false);
    }

    // Navigate to OTP verification only if OTP was sent successfully
    if (otpSent && tempPhoneNumber && !error) {
      console.log('OTP sent, navigating to verification with phone:', tempPhoneNumber);
      navigation.navigate('OTPVerification', { phoneNumber: tempPhoneNumber });
    }
  }, [error, otpSent, tempPhoneNumber, navigation, registrationAttempted]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoPosition.value }],
  }));

  const formStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formPosition.value }],
  }));

  const handlePhoneChange = (text: string, formatted: string) => {
    setPhoneNumber(text);
    setFormattedPhoneNumber(formatted);
  };

  const handleSignup = async () => {
    // Validate inputs
    if (!fullName.trim()) {
      Alert.alert('Invalid Input', 'Please enter your full name');
      return;
    }

    if (!isPhoneValid || !formattedPhoneNumber) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }

    // Clear any previous errors
    dispatch(clearError());
    dispatch(setAuthMode('register'));

    setRegistrationAttempted(true);

    try {
      const result = await dispatch(
        initiateRegister({
          fullName: fullName.trim(),
          phoneNumber: formattedPhoneNumber.trim(),
        })
      );

      if (result.meta.requestStatus === 'rejected') {
        console.error('Registration failed:', result.payload);
      } else {
        console.log('Registration successful, waiting for OTP verification');
      }
    } catch (err) {
      console.error('Failed to register:', err);
      Alert.alert('Registration Error', 'An unexpected error occurred. Please try again later.');
      setRegistrationAttempted(false);
    }
  };

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
          {/* Logo Image */}
          <Animated.Image
            source={require('../../assets/images/logo.png')}
            className="absolute -top-[8.5%] z-10 h-[400px] w-[400px] self-center"
            style={logoStyle}
            resizeMode="contain"
          />

          {/* Signup Form Container */}
          <Animated.View
            className="absolute top-[27%] z-20 h-[73%] w-full rounded-t-[40px] bg-white"
            style={formStyle}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              className="flex-1"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View className="flex-1 px-5 pb-10 pt-10">
                {canGoBack && (
                  <View className="absolute right-5 top-4 z-10">
                    <GoBackButton onPress={handleGoBack} />
                  </View>
                )}

                {/* Headers */}
                <Title text="New to Crew?\nSign Up" containerClassName="mb-6" />

                {/* Full Name Input */}
                <TextInputField
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  icon={require('../../assets/images/contact.png')}
                  containerClassName="mb-3"
                />

                {/* Phone Number Input - Using the PhoneInputField component */}
                <PhoneInputField
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  onValidChange={setIsPhoneValid}
                  placeholder="Phone Number"
                  containerClassName="mb-4"
                />

                {/* Sign Up Button */}
                <CrewButton
                  variant="filled"
                  text="Sign up"
                  color="secondary"
                  size="large"
                  onPress={handleSignup}
                  loading={isLoading}
                  disabled={!fullName.trim() || !isPhoneValid || isLoading}
                  className="mt-6"
                />

                {/* Bottom Text */}
                <View className="mb-4 mt-2 flex-row items-center justify-center">
                  <Text className="pt-4 font-cairo text-sm text-gray-500">
                    Already have an account?{' '}
                    <Text
                      className="font-cairo text-sm font-bold text-primary-dark underline"
                      onPress={() => navigation.navigate('Signin')}>
                      Sign in.
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

export default Signup;
