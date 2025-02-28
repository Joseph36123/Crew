// screens/auth/phone-verification.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CrewButton, OTPInput, Title, Subtitle } from '../../components/atoms';
import { AuthStackParamList } from '../../types/types';

const { height } = Dimensions.get('window');

type OTPVerificationRouteProp = RouteProp<AuthStackParamList, 'OTPVerification'>;
type OTPVerificationNavigationProp = StackNavigationProp<AuthStackParamList, 'OTPVerification'>;

const PhoneVerificationScreen: React.FC = () => {
  const navigation = useNavigation<OTPVerificationNavigationProp>();
  const route = useRoute<OTPVerificationRouteProp>();
  const phoneNumber = route.params?.phoneNumber ?? '';

  // OTP Input state
  const [otp, setOtp] = useState(['', '', '', '']);

  // Countdown for re-sending code
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!canResend && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, canResend]);

  const handleResendCode = () => {
    setCountdown(60);
    setCanResend(false);
    // (API call to resend the OTP can be triggered here.)
  };

  const handleContinue = () => {
    // Validate the OTP
    if (otp.join('').length !== 4) {
      console.log('Please enter a valid OTP');
      return;
    }
    
    // Navigate to Terms & Conditions screen
    navigation.navigate('TermsConditions');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
        <View className="absolute top-[30%] z-20 h-[70%] w-full rounded-t-[40px] bg-white">
          <View className="flex-1 items-center px-5 pb-10 pt-8">
            {/* Title Text */}
            <Title 
              text="Enter 4 digit code we have sent you on"
              containerClassName="mb-2"
            />

            {/* Phone Number Text */}
            {phoneNumber ? (
              <Subtitle
                text={phoneNumber}
                containerClassName="mb-6"
                textClassName="text-xl"
              />
            ) : null}

            {/* OTP Input Boxes */}
            <OTPInput
              length={4}
              value={otp}
              onChange={setOtp}
              containerClassName="mb-3 space-x-8"
              inputClassName="h-20 w-20 text-3xl"
            />

            {/* Code Expiration Text */}
            <Text className="font-cairo mb-6 text-sm text-gray-500">
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
              disabled={otp.join('').length !== 4}
            />

            {/* Resend Text */}
            <View className="mt-5">
              {canResend ? (
                <Text
                  onPress={handleResendCode}
                  className="font-cairo text-center text-sm font-bold text-gray-500 underline"
                >
                  Didn&apos;t receive a code? Send again
                </Text>
              ) : (
                <Text className="font-cairo text-center text-sm text-gray-500">
                  Didn&apos;t receive a code? Send again in {countdown} seconds.
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PhoneVerificationScreen;