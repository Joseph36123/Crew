import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { Signin, Signup, OTPVerification } from 'screens/auth';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator initialRouteName="Signup" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Signin" component={Signin} options={{ title: 'Sign In' }} />
      <Stack.Screen name="Signup" component={Signup} options={{ title: 'Sign Up' }} />
      <Stack.Screen
        name="OTPVerification"
        component={OTPVerification}
        options={{ title: 'OTP Verification' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
