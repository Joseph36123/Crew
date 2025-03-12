import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileBasicInfo from '../screens/profile/ProfileBasicInfo';
import { ProfileSetupStackParamList } from '../types/types';

const Stack = createStackNavigator<ProfileSetupStackParamList>();

const ProfileSetupNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileBasicInfo"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileBasicInfo" component={ProfileBasicInfo} />
      {/* Add more profile setup screens as needed */}
    </Stack.Navigator>
  );
};

export default ProfileSetupNavigator;