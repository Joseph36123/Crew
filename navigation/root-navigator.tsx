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

  // Reference to track if initial auth check has started
  const checkStartedRef = useRef(false);

  // Effect for mandatory splash screen duration
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

  // Listen for AsyncStorage changes (for navigation state)
  useEffect(() => {
    const checkOnboardingProgress = async () => {
      if (isAuthenticated) {
        const termsAccepted = await AsyncStorage.getItem('termsAccepted');
        setHasAcceptedTerms(termsAccepted === 'true');

        const notificationsSet = await AsyncStorage.getItem('notificationsSet');
        setHasSetNotifications(notificationsSet === 'true');
      }
    };

    // Set up interval to periodically check AsyncStorage
    const intervalId = setInterval(checkOnboardingProgress, 1000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  // Effect for checking profile status when authenticated and onboarding complete
  useEffect(() => {
    if (isAuthenticated && userId && hasAcceptedTerms && hasSetNotifications) {
      dispatch(checkProfileStatus(userId));
    }
  }, [isAuthenticated, userId, hasAcceptedTerms, hasSetNotifications, dispatch]);

  console.log('Navigation state:', {
    showSplash,
    initialCheckComplete,
    isAuthenticated,
    isProfileComplete,
    otpSent,
    hasAcceptedTerms,
    hasSetNotifications,
  });

  // Always show splash screen during initial loading or for minimum duration
  if (showSplash || !initialCheckComplete || authLoading || profileLoading) {
    console.log('Showing splash screen');
    return <SplashScreen />;
  }

  // Special case: If OTP is sent and user is still in verification process, stay in auth flow
  if (otpSent && !isAuthenticated) {
    console.log('OTP sent, keeping auth navigation');
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
      </Stack.Navigator>
    );
  }

  console.log('Determining main navigation flow');

  // Handle the full navigation flow
  if (!isAuthenticated) {
    // Not authenticated - show auth flow
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
      </Stack.Navigator>
    );
  } else if (!hasAcceptedTerms || !hasSetNotifications) {
    // Show onboarding flow if either terms or notifications are not complete
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      </Stack.Navigator>
    );
  } else if (!isProfileComplete) {
    // Show profile setup if onboarding is complete but profile isn't
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="profileSetUp" component={ProfileSetupNavigator} />
      </Stack.Navigator>
    );
  } else {
    // All steps complete - show main app
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
      </Stack.Navigator>
    );
  }
}
