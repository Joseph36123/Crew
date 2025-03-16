import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileBasicInfo from '../screens/profile/ProfileBasicInfo';
import ProfilePhoto from '../screens/profile/ProfilePhoto';
import { ProfileSetupStackParamList } from '../types/types';
import VibeSelection from 'screens/profile/VibeSelection';
import HobbiesSelection from 'screens/profile/HobbiesSelection';
import SceneSelection from 'screens/profile/SceneSelection';
import ProfileSummary from 'screens/profile/PreferenceSummary';

const Stack = createStackNavigator<ProfileSetupStackParamList>();

const ProfileSetupNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ProfileBasicInfo" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileBasicInfo" component={ProfileBasicInfo} />
      <Stack.Screen name="ProfilePhoto" component={ProfilePhoto} />
      <Stack.Screen name="VibeSelection" component={VibeSelection} />
      <Stack.Screen name="SceneSelection" component={SceneSelection} />
      <Stack.Screen name="HobbiesSelection" component={HobbiesSelection} />
      <Stack.Screen name="PreferenceSummary" component={ProfileSummary} />
    </Stack.Navigator>
  );
};

export default ProfileSetupNavigator;
