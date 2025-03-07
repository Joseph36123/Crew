import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { CrewButton } from '../components/atoms';
import { useAppDispatch, useAppSelector } from '../store';
import { completeProfile } from '../store/slices/profileSlice';
import { RootStackParamList, ProfileSetupStackParamList } from '../types/types';

const Stack = createStackNavigator<ProfileSetupStackParamList>();

const ProfileSetupPlaceholder = () => {
  // Properly typed navigation
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector((state) => state.auth);

  const handleCompleteProfile = async () => {
    if (userId) {
      // Create a form data object with profile information
      const formData = new FormData();
      formData.append('bio', 'This is a placeholder bio');

      // Complete the profile
      await dispatch(completeProfile({ userId, profileData: formData }));

      // Reset navigation to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'TabNavigator' }],
      });
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="mb-6 text-center text-xl font-bold">Profile Setup Screen</Text>
      <Text className="mb-8 text-center">
        This is a placeholder for your multi-step profile completion flow. Replace this with your
        actual profile setup screens.
      </Text>
      <CrewButton
        variant="filled"
        text="Complete Profile"
        color="secondary"
        size="large"
        fullWidth={true}
        onPress={handleCompleteProfile}
      />
    </View>
  );
};

const ProfileSetupNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileSetupPlaceholder"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileSetupPlaceholder" component={ProfileSetupPlaceholder} />
    </Stack.Navigator>
  );
};

export default ProfileSetupNavigator;
