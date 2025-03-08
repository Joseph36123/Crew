import React, { useEffect, useState, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/SplashScreen';
import AuthNavigator from './auth-navigator';
import OnboardingNavigator from './onboarding-navigator';
import TabNavigator from './tab-navigator';
import ProfileSetupNavigator from './profileSetupNavigator';
import { RootStackParamList } from '../types/types';
import { useAppDispatch, useAppSelector } from '../store';
import { checkAuthStatus } from '../store/slices/authSlice';
import { checkProfileStatus } from '../store/slices/profileSlice';

const Stack = createStackNavigator<RootStackParamList>();

const SPLASH_DURATION = 2000;

export default function RootNavigator() {
  const dispatch = useAppDispatch();
  const {
    isAuthenticated,
    isLoading: authLoading,
    userId,
    otpSent,
  } = useAppSelector((state) => state.auth);
  const { isProfileComplete, isLoading: profileLoading } = useAppSelector((state) => state.profile);

  // State to control splash screen visibility
  const [showSplash, setShowSplash] = useState(true);

  // State to track if initial auth check is complete
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  // States to track onboarding steps
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean | null>(null);
  const [hasSetNotifications, setHasSetNotifications] = useState<boolean | null>(null);

  // State to track navigation ready status (for transitions between navigators)
  const [navigationReady, setNavigationReady] = useState(false);

  // Reference to track if initial auth check has started
  const checkStartedRef = useRef(false);

  // Effect for mandatory splash screen duration - ONLY ON INITIAL APP LOAD
  useEffect(() => {
    console.log('Starting splash screen timer');
    // Always show splash for minimum duration
    const timer = setTimeout(() => {
      console.log('Splash screen timer complete');
      setShowSplash(false);
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  // Effect for checking authentication and onboarding status
  useEffect(() => {
    const checkStatus = async () => {
      if (checkStartedRef.current) return;

      checkStartedRef.current = true;
      console.log('Checking auth status and onboarding...');

      try {
        // Check authentication status
        await dispatch(checkAuthStatus());

        // Check onboarding steps
        const termsAccepted = await AsyncStorage.getItem('termsAccepted');
        setHasAcceptedTerms(termsAccepted === 'true');

        const notificationsSet = await AsyncStorage.getItem('notificationsSet');
        setHasSetNotifications(notificationsSet === 'true');

        // After all checks are done, mark initial loading as complete
        setInitialCheckComplete(true);
        console.log('Initial checks complete:', {
          termsAccepted: termsAccepted === 'true',
          notificationsSet: notificationsSet === 'true',
        });
      } catch (error) {
        console.error('Failed to check status:', error);
        setInitialCheckComplete(true);
      }
    };

    checkStatus();
  }, [dispatch]);

  // Effect to listen for navigation ready status (set by notification screen)
  useEffect(() => {
    const checkNavigationReady = async () => {
      const isReady = await AsyncStorage.getItem('navigationReady');
      setNavigationReady(isReady === 'true');

      if (isReady === 'true') {
        // Re-check onboarding status to ensure we have the latest values
        const termsAccepted = await AsyncStorage.getItem('termsAccepted');
        setHasAcceptedTerms(termsAccepted === 'true');

        const notificationsSet = await AsyncStorage.getItem('notificationsSet');
        setHasSetNotifications(notificationsSet === 'true');

        // If user is authenticated, check their profile status
        if (isAuthenticated && userId) {
          dispatch(checkProfileStatus(userId));
        }

        // Reset the navigation ready flag so it can be used again if needed
        await AsyncStorage.removeItem('navigationReady');
        setNavigationReady(false);
      }
    };

    // Set up a polling mechanism to check for navigation ready status
    const intervalId = setInterval(checkNavigationReady, 500);

    return () => clearInterval(intervalId);
  }, [dispatch, isAuthenticated, userId]);

  // Effect for updating onboarding status when authentication state changes
  useEffect(() => {
    if (isAuthenticated && userId) {
      const checkOnboardingStatus = async () => {
        const termsAccepted = await AsyncStorage.getItem('termsAccepted');
        setHasAcceptedTerms(termsAccepted === 'true');

        const notificationsSet = await AsyncStorage.getItem('notificationsSet');
        setHasSetNotifications(notificationsSet === 'true');

        // Check profile status when auth changes
        dispatch(checkProfileStatus(userId));
      };

      checkOnboardingStatus();
    }
  }, [isAuthenticated, userId, dispatch]);

  console.log('Navigation state:', {
    showSplash,
    initialCheckComplete,
    isAuthenticated,
    isProfileComplete,
    otpSent,
    hasAcceptedTerms,
    hasSetNotifications,
    navigationReady,
  });

  // Only show splash screen during initial app load
  if (showSplash || !initialCheckComplete) {
    console.log('Showing splash screen');
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : !hasAcceptedTerms || !hasSetNotifications ? (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : !isProfileComplete ? (
        <Stack.Screen name="profileSetUp" component={ProfileSetupNavigator} />
      ) : (
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
}
