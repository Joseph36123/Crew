import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ProfileBasicInfo from './screens/profile/ProfileBasicInfo';

const Stack = createStackNavigator();

/**
 * This is a testing component that allows you to directly run the Profile Setup screen
 * without going through the authentication flow.
 * 
 * To use this component:
 * 1. Import it in App.tsx
 * 2. Replace the current app export with this component
 * 
 * Example:
 * 
 * // In App.tsx
 * import TestProfileScreen from './TestProfileScreen';
 * 
 * export default function App() {
 *   return <TestProfileScreen />;
 * }
 */
const TestProfileScreen = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ProfileBasicInfo" component={ProfileBasicInfo} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default TestProfileScreen;