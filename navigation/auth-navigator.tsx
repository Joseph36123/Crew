import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Signin, Signup, OTPVerification } from '../screens/auth';
import { AuthStackParamList } from '../types/types';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Signup"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#191919' },
      }}>
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="OTPVerification" component={OTPVerification} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
