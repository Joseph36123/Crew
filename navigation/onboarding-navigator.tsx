import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TermsConditionsScreen from '../screens/auth/terms-conditions';
import NotificationsScreen from '../screens/auth/notifications';

export type OnboardingStackParamList = {
  TermsConditions: undefined;
  Notifications: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="TermsConditions"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
