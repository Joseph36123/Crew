import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
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
import { CrewButton } from 'components/atoms';

const { height } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const Signup = () => {
  const navigation = useNavigation<NavigationProp>();

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoPosition = useSharedValue(-100);
  const formOpacity = useSharedValue(0);
  const formPosition = useSharedValue(height * 0.3);

  useEffect(() => {
    // Delayed entrance animations
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    logoPosition.value = withDelay(300, withTiming(0, { duration: 800 }));

    formOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    formPosition.value = withDelay(800, withTiming(0, { duration: 800 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoPosition.value }],
  }));

  const formStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formPosition.value }],
  }));

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          className="absolute top-[30%] z-20 h-[70%] w-full rounded-t-[40px] bg-white"
          style={formStyle}>
          <View className="flex-1 items-center justify-start px-5 pb-10 pt-8">
            {/* Headers */}
            <View className="mb-4 items-center">
              <Text className="font-cairo text-center text-3xl font-bold text-gray-900">
                New to Crew?
              </Text>
              <Text className="font-cairo mt-0.5 text-center text-3xl font-bold text-gray-900">
                Sign Up
              </Text>
            </View>

            {/* Full Name Input */}
            <View className="my-2.5 h-[50px] w-full justify-center rounded-full border border-gray-500 bg-white px-4">
              <View className="flex-row items-center justify-between">
                <TextInput
                  className="font-cairo flex-1 text-sm text-black"
                  placeholder="Full Name"
                  placeholderTextColor="#C2C2C2"
                />
                <Image
                  source={require('../../assets/images/contact.png')}
                  className="h-6 w-6"
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Phone Number Input */}
            <View className="my-2.5 h-[50px] w-full justify-center rounded-full border border-gray-500 bg-white px-4">
              <View className="flex-row items-center justify-between">
                <TextInput
                  className="font-cairo flex-1 text-sm text-black"
                  placeholder="Phone Number"
                  placeholderTextColor="#C2C2C2"
                  keyboardType="phone-pad"
                />
                <Image
                  source={require('../../assets/images/phone.png')}
                  className="h-6 w-6"
                  resizeMode="contain"
                />
              </View>
            </View>
            <CrewButton
              variant="filled"
              text="Sign up"
              // iconName="send"
              iconFamily="MaterialIcons"
              color="secondary"
              size="large"
              onPress={() => console.log('Pressed')}
              loading={false}
              disabled={false}
            />

            {/* Bottom Text */}
            <Text className="font-cairo text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Text
                className="font-cairo text-sm font-bold text-gray-500 underline"
                onPress={() => navigation.navigate('Signin')}>
                Sign in.
              </Text>
            </Text>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Signup;
