import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileBasicInfo from '../screens/profile/ProfileBasicInfo';
import ProfilePhoto from '../screens/profile/ProfilePhoto';
import { ProfileSetupStackParamList } from '../types/types';

const Stack = createStackNavigator<ProfileSetupStackParamList>();

const ProfileSetupNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileBasicInfo"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileBasicInfo" component={ProfileBasicInfo} />
      <Stack.Screen name="ProfilePhoto" component={ProfilePhoto} />
      {/* Add more profile setup screens as needed */}
    </Stack.Navigator>
  );
};

export default ProfileSetupNavigator;