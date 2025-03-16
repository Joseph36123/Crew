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
import { checkAuthStatus, invalidateSession } from '../store/slices/authSlice';
import { checkProfileStatus } from '../store/slices/profileSlice';

const Stack = createStackNavigator<RootStackParamList>();

// Minimum splash screen duration in milliseconds
const SPLASH_DURATION = 3500;

export default function RootNavigator() {
  const dispatch = useAppDispatch();
  const {
    isAuthenticated,
    isLoading: authLoading,
    userId,
    error: authError,
  } = useAppSelector((state) => state.auth);

  const {
    isProfileComplete,
    isLoading: profileLoading,
    error: profileError,
  } = useAppSelector((state) => state.profile);

  // State to manage app initialization
  const [isInitializing, setIsInitializing] = useState(true);
  const [splashMinTimeElapsed, setSplashMinTimeElapsed] = useState(false);

  // States to track onboarding completion
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);
  const [hasSetNotifications, setHasSetNotifications] = useState<boolean>(false);

  // Refs to track state and prevent unnecessary re-renders
  const initialCheckDoneRef = useRef(false);
  const isHandlingErrorRef = useRef(false);

  // Handle initial app loading and splash screen
  useEffect(() => {
    // Timer for minimum splash screen duration
    const splashTimer = setTimeout(() => {
      setSplashMinTimeElapsed(true);
    }, SPLASH_DURATION);

    // Initial data loading - only do this once
    const initializeApp = async () => {
      if (initialCheckDoneRef.current) return;

      try {
        console.log('Initializing app - first time check');
        // Check authentication status first
        await dispatch(checkAuthStatus());

        // Check onboarding completion status
        const termsAccepted = await AsyncStorage.getItem('termsAccepted');
        const notificationsSet = await AsyncStorage.getItem('notificationsSet');

        setHasAcceptedTerms(termsAccepted === 'true');
        setHasSetNotifications(notificationsSet === 'true');

        // Mark initialization as complete and set ref to prevent re-running
        setIsInitializing(false);
        initialCheckDoneRef.current = true;
      } catch (error) {
        console.error('App initialization error:', error);
        setIsInitializing(false);
        initialCheckDoneRef.current = true;
      }
    };

    initializeApp();

    return () => clearTimeout(splashTimer);
  }, [dispatch]);

  // Check profile status when user is authenticated and onboarding is complete
  useEffect(() => {
    if (isAuthenticated && userId && hasAcceptedTerms && hasSetNotifications) {
      console.log('Checking profile status for authenticated user');
      dispatch(checkProfileStatus(userId));
    }
  }, [isAuthenticated, userId, hasAcceptedTerms, hasSetNotifications, dispatch]);

  // Handle profile errors only
  useEffect(() => {
    // Only handle profile errors if the user is authenticated and we're not already handling an error
    if (isAuthenticated && profileError && !isHandlingErrorRef.current) {
      // Handle session expiration or authorization errors
      if (
        typeof profileError === 'string' &&
        (profileError.includes('Unauthorized') || profileError.includes('expired'))
      ) {
        console.log('Profile unauthorized error detected, handling session invalidation');

        isHandlingErrorRef.current = true;
        // Use invalidateSession to show a message and log out
        dispatch(invalidateSession('Your session has expired. Please log in again.')).finally(
          () => {
            isHandlingErrorRef.current = false;
          }
        );
      }
    }
  }, [profileError, isAuthenticated, dispatch]);

  // Listen for changes in onboarding status - with reduced polling frequency
  useEffect(() => {
    // Only check onboarding status when authentication changes or on initial load
    const checkOnboardingStatus = async () => {
      if (isAuthenticated) {
        const termsAccepted = await AsyncStorage.getItem('termsAccepted');
        const notificationsSet = await AsyncStorage.getItem('notificationsSet');

        setHasAcceptedTerms(termsAccepted === 'true');
        setHasSetNotifications(notificationsSet === 'true');
      }
    };

    // Only check on auth state change
    checkOnboardingStatus();

    // Use a longer interval to reduce unnecessary checks
    const intervalId = setInterval(checkOnboardingStatus, 3000);
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  // Determine if we should still show the splash screen
  // IMPORTANT: We ONLY show splash during initial load, never for auth errors
  const showSplash = isInitializing || !splashMinTimeElapsed;

  // For debugging
  console.log('Navigation state:', {
    showSplash,
    isInitializing,
    splashMinTimeElapsed,
    isAuthenticated,
    authLoading,
    isProfileComplete,
    hasAcceptedTerms,
    hasSetNotifications,
    profileError,
  });

  // Show splash screen ONLY during initialization
  if (showSplash) {
    return <SplashScreen />;
  }

  // Main navigation structure
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Authentication flow
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : !hasAcceptedTerms || !hasSetNotifications ? (
        // Onboarding flow
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : !isProfileComplete ? (
        // Profile setup flow
        <Stack.Screen name="profileSetUp" component={ProfileSetupNavigator} />
      ) : (
        // Main app
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
}
