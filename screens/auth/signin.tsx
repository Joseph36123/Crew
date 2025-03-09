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
import { CrewButton, GoBackButton, Title } from '../../components/atoms';
import PhoneInputField from '../../components/atoms/PhoneInputField';
import { useAppDispatch, useAppSelector } from '../../store';
import { initiateLogin, setAuthMode, clearError } from '../../store/slices/authSlice';

const { height } = Dimensions.get('window');

type SigninNavigationProp = StackNavigationProp<AuthStackParamList, 'Signin'>;

const Signin: React.FC = () => {
  const navigation = useNavigation<SigninNavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error, tempPhoneNumber, otpSent } = useAppSelector((state) => state.auth);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);

  const logoOpacity = useSharedValue(0);
  const logoPosition = useSharedValue(-100);
  const formOpacity = useSharedValue(0);
  const formPosition = useSharedValue(height * 0.3);

  useEffect(() => {
    setCanGoBack(navigation.canGoBack?.() || false);
  }, [navigation]);
  useEffect(() => {
    dispatch(clearError());
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    logoPosition.value = withDelay(300, withTiming(0, { duration: 800 }));

    formOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    formPosition.value = withDelay(800, withTiming(0, { duration: 800 }));
  }, [dispatch, logoOpacity, logoPosition, formOpacity, formPosition]);

  useEffect(() => {
    if (error && loginAttempted) {
      Alert.alert('Login Error', error || 'There was a problem signing in. Please try again.');
      setLoginAttempted(false);
    }

    if (otpSent && tempPhoneNumber && !error) {
      console.log('OTP sent, navigating to verification with phone:', tempPhoneNumber);
      navigation.navigate('OTPVerification', { phoneNumber: tempPhoneNumber });
    }
  }, [error, otpSent, tempPhoneNumber, navigation, loginAttempted]);

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

  const handleSendCode = async () => {
    if (!isPhoneValid || !formattedPhoneNumber) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }
    dispatch(clearError());
    dispatch(setAuthMode('login'));
    setLoginAttempted(true);

    try {
      console.log('Initiating login for phone number:', formattedPhoneNumber);
      const result = await dispatch(initiateLogin(formattedPhoneNumber));
      if (result.meta.requestStatus === 'rejected') {
        console.error('Login failed:', result.payload);
      } else {
        console.log('Login process started, waiting for OTP verification');
      }
    } catch (err) {
      console.error('Failed to initiate login:', err);
      Alert.alert('Login Error', 'An unexpected error occurred. Please try again later.');
      setLoginAttempted(false);
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
          <Animated.Image
            source={require('../../assets/images/logo.png')}
            className="absolute -top-[8.5%] z-10 h-[400px] w-[400px] self-center"
            style={logoStyle}
            resizeMode="contain"
          />

          <Animated.View
            className="absolute top-[27%] z-20 h-[73%] w-full rounded-t-[40px] bg-white"
            style={formStyle}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              className="flex-1"
              showsVerticalScrollIndicator={false}>
              <View className="flex-1 px-5 pb-10 pt-10">
                {canGoBack && (
                  <View className="absolute right-5 top-4 z-10">
                    <GoBackButton onPress={handleGoBack} />
                  </View>
                )}
                <Title text="Sign in" align="left" containerClassName="mb-8" />
                <PhoneInputField
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  onValidChange={setIsPhoneValid}
                  placeholder="Phone Number"
                  containerClassName="mt-4"
                />
                <CrewButton
                  variant="filled"
                  text="Send Code"
                  color="secondary"
                  size="large"
                  onPress={handleSendCode}
                  loading={isLoading}
                  disabled={!isPhoneValid || isLoading}
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
