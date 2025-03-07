// navigation/auth-navigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { Signin, Signup, OTPVerification } from '../screens/auth';
import TermsConditionsScreen from '../screens/auth/terms-conditions';
import NotificationsScreen from '../screens/auth/notifications';
import { AuthStackParamList } from '../types/types';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      initialRouteName="Signup"
      screenOptions={{
        headerShown: false,
        // This prevents gesture navigation issues
        gestureEnabled: false,
      }}>
      <Stack.Screen name="Signin" component={Signin} options={{ title: 'Sign In' }} />
      <Stack.Screen name="Signup" component={Signup} options={{ title: 'Sign Up' }} />
      <Stack.Screen
        name="OTPVerification"
        component={OTPVerification}
        options={{ title: 'OTP Verification' }}
      />
      <Stack.Screen
        name="TermsConditions"
        component={TermsConditionsScreen}
        options={{ title: 'Terms & Conditions' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
