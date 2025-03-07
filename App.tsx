// App.tsx
import './global.css';

import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import {
  useFonts,
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
  Cairo_300Light,
  Cairo_800ExtraBold,
} from '@expo-google-fonts/cairo';
import RootNavigator from './navigation/root-navigator';
import ReduxProvider from './store/ReduxProvider';

export default function App() {
  // Load fonts
  let [fontsLoaded, fontError] = useFonts({
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Cairo_300Light,
    Cairo_800ExtraBold,
  });

  if (!fontsLoaded && fontError) {
    return null;
  }

  return (
    <ReduxProvider>
      <PaperProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}
