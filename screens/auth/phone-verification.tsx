import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CrewButton, OTPInput, Title, Subtitle } from '../../components/atoms';
import { AuthStackParamList } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { verifyOTP, resendOTP, clearError } from '../../store/slices/authSlice';

const { height } = Dimensions.get('window');

type OTPVerificationRouteProp = RouteProp<AuthStackParamList, 'OTPVerification'>;
type OTPVerificationNavigationProp = StackNavigationProp<AuthStackParamList, 'OTPVerification'>;

const PhoneVerificationScreen: React.FC = () => {
  const navigation = useNavigation<OTPVerificationNavigationProp>();
  const route = useRoute<OTPVerificationRouteProp>();
  const phoneNumber = route.params?.phoneNumber ?? '';
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, currentAuthMode } = useAppSelector(
    (state) => state.auth
  );

  const [otp, setOtp] = useState(['', '', '', '']);

  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!canResend && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, canResend]);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (error) {
      Alert.alert('Verification Error', error);
    }
  }, [error, isAuthenticated, navigation]);

  const handleResendCode = async () => {
    if (phoneNumber) {
      try {
        console.log('Resending OTP for phone number:', phoneNumber);
        const result = await dispatch(resendOTP(phoneNumber));

        if (result.meta.requestStatus === 'fulfilled') {
          setCountdown(60);
          setCanResend(false);
          setOtp(['', '', '', '']);
          Alert.alert('Success', 'OTP has been resent to your phone.');
        }
      } catch (err) {
        console.error('Failed to resend OTP:', err);
      }
    }
  };

  const handleContinue = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP');
      return;
    }

    try {
      console.log('Verifying OTP:', fullOtp, 'for phone:', phoneNumber);

      const result = await dispatch(verifyOTP({ phoneNumber, otp: fullOtp }));

      if (result.meta.requestStatus !== 'fulfilled') {
        Alert.alert(
          'Verification Failed',
          String(result.payload) || 'Invalid OTP. Please try again.'
        );
      } else {
        console.log('OTP verification successful');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <View className="flex-1 bg-[#191919]">
          {/* Crew Logo: Fixed position, no animation */}
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

          {/* Bottom Portion: Static View */}
          <View className="absolute top-[27%] z-20 h-[73%] w-full rounded-t-[40px] bg-white">
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              className="flex-1"
              showsVerticalScrollIndicator={false}>
              <View className="flex-1 items-center px-5 pb-10 pt-10">
                {/* Title Text */}
                <Title text="Enter 4 digit code we have sent you on" containerClassName="mb-4" />

                {/* Phone Number Text */}
                {phoneNumber ? (
                  <Subtitle
                    text={phoneNumber}
                    containerClassName="mb-8"
                    textClassName="text-xl font-bold"
                  />
                ) : null}

                {/* OTP Input Boxes */}
                <View className="w-full items-center justify-center py-4">
                  <OTPInput
                    length={4}
                    value={otp}
                    onChange={setOtp}
                    containerClassName="mb-6 space-x-4"
                    inputClassName="h-20 w-20 text-3xl"
                  />
                </View>

                {/* Code Expiration Text */}
                <Text className="mb-8 font-cairo text-sm text-gray-500">
                  Code expires in 2 minutes
                </Text>

                {/* Continue Button using CrewButton component */}
                <CrewButton
                  variant="filled"
                  text="Continue"
                  color="secondary"
                  size="large"
                  fullWidth={true}
                  onPress={handleContinue}
                  disabled={otp.join('').length !== 4 || isLoading}
                  loading={isLoading}
                  className="mt-4"
                />

                {/* Resend Text */}
                <View className="mt-8">
                  {canResend ? (
                    <Text
                      onPress={handleResendCode}
                      className="text-center font-cairo text-sm font-bold text-gray-500 underline">
                      Didn&apos;t receive a code? Send again
                    </Text>
                  ) : (
                    <Text className="text-center font-cairo text-sm text-gray-500">
                      Didn&apos;t receive a code? Send again in {countdown} seconds.
                    </Text>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default PhoneVerificationScreen;
