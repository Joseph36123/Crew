import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
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
import { CrewButton, TextInputField, Title } from '../../components/atoms';
import { useAppDispatch, useAppSelector } from '../../store';
import { initiateRegister, setAuthMode, clearError } from '../../store/slices/authSlice';

const { height } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const Signup = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error, tempPhoneNumber, otpSent } = useAppSelector((state) => state.auth);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoPosition = useSharedValue(-100);
  const formOpacity = useSharedValue(0);
  const formPosition = useSharedValue(height * 0.3);

  useEffect(() => {
    // Clear any errors when component mounts
    dispatch(clearError());

    // Delayed entrance animations
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    logoPosition.value = withDelay(300, withTiming(0, { duration: 800 }));

    formOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    formPosition.value = withDelay(800, withTiming(0, { duration: 800 }));
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
    }
    // if OTP has been sent, navigate to OTP verification screen
    if (otpSent && tempPhoneNumber) {
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

  const validatePhoneNumber = (number: string) => {
    // Simple validation for US phone number (just checking if it has at least 10 digits)
    const digitsOnly = number.replace(/\D/g, '');
    return digitsOnly.length >= 10;
  };

  const handleSignup = async () => {
    // Validate inputs
    if (!fullName.trim()) {
      Alert.alert('Invalid Input', 'Please enter your full name');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError('Please enter a valid phone number');
      return;
    }

    // Clear any previous errors
    setPhoneError('');
    dispatch(clearError());

    // Setting auth mode
    dispatch(setAuthMode('register'));

    try {
      // Dispatch register action
      await dispatch(
        initiateRegister({
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
        })
      );

      // Navigation is handled by the useEffect that watches otpSent
    } catch (err) {
      console.error('Failed to register:', err);
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
              showsVerticalScrollIndicator={false}>
              <View className="flex-1 items-center justify-start px-5 pb-10 pt-10">
                {/* Headers */}
                <Title text="New to Crew?\nSign Up" containerClassName="mb-8" />

                {/* Full Name Input */}
                <TextInputField
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  icon={require('../../assets/images/contact.png')}
                  containerClassName="mb-4"
                />

                {/* Phone Number Input */}
                <TextInputField
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    if (phoneError) setPhoneError('');
                  }}
                  icon={require('../../assets/images/phone.png')}
                />

                {/* Phone Number Error */}
                {phoneError ? (
                  <Text className="mt-1 self-start font-cairo text-xs text-red-500">
                    {phoneError}
                  </Text>
                ) : null}

                {/* Sign Up Button */}
                <CrewButton
                  variant="filled"
                  text="Sign up"
                  color="secondary"
                  size="large"
                  onPress={handleSignup}
                  loading={isLoading}
                  disabled={!fullName.trim() || !phoneNumber.trim() || isLoading}
                  className="mt-8"
                />

                {/* Bottom Text */}
                <View className="mb-4 mt-2 flex-row items-center justify-center">
                  <Text className="pt-4 font-cairo text-sm text-gray-500">
                    Already have an account?{' '}
                    <Text
                      className="font-cairo text-sm font-bold text-primary-dark underline "
                      onPress={() => navigation.navigate('Signin')}>
                      Sign In.
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
