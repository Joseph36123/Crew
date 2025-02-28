// screens/auth/signin.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/types';
import { CrewButton, TextInputField, GoBackButton } from '../../components/atoms';

const { height } = Dimensions.get('window');

type SigninNavigationProp = StackNavigationProp<AuthStackParamList, 'Signin'>;

const Signin: React.FC = () => {
  const navigation = useNavigation<SigninNavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState('');

  const validatePhoneNumber = () => {
    // Simple validation for US phone number (just checking if it has at least 10 digits)
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    return digitsOnly.length >= 10;
  };

  const handleSendCode = () => {
    if (!validatePhoneNumber()) {
      // Alert the user if the phone number is invalid
      console.log('Please enter a valid US phone number');
      return;
    }

    // Navigate to OTP verification with phone number as parameter
    navigation.navigate('OTPVerification', { phoneNumber });
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
            <Text className="font-cairo mb-8 mt-10 text-4xl font-bold text-[#0D0F0F]">
              Sign in
            </Text>

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
              disabled={!validatePhoneNumber()}
              className="mt-6"
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Signin;