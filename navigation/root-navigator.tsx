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
import { checkAuthStatus, invalidateSession, logout } from '../store/slices/authSlice';
import { checkProfileStatus } from '../store/slices/profileSlice';
import LoadingScreen from 'components/molecules/LoadingScreen';

const Stack = createStackNavigator<RootStackParamList>();

// Minimum splash screen duration in milliseconds
const SPLASH_DURATION = 3500;
// Minimum loading screen duration in milliseconds
const MIN_LOADING_DURATION = 2500; // Increased to 2.5 seconds for a more noticeable transition

export default function RootNavigator() {
  const dispatch = useAppDispatch();
  const {
    isAuthenticated,
    isLoading: authLoading,
    userId,
    token,
    error: authError,
  } = useAppSelector((state) => state.auth);

  const {
    isProfileComplete,
    isLoading: profileLoading,
    error: profileError,
  } = useAppSelector((state) => state.profile);

  // App state management
  const [appState, setAppState] = useState<'splash' | 'loading' | 'ready'>('splash');
  const [navigationTarget, setNavigationTarget] = useState<
    'auth' | 'onboarding' | 'profile' | 'main'
  >('auth');

  // States to track onboarding completion
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);
  const [hasSetNotifications, setHasSetNotifications] = useState<boolean>(false);
  const [localProfileComplete, setLocalProfileComplete] = useState<boolean>(false);

  // Refs to track state and prevent unnecessary re-renders
  const initialCheckDoneRef = useRef(false);
  const isHandlingErrorRef = useRef(false);
  const sessionValidatedRef = useRef(false);
  const loadingStartTimeRef = useRef<number>(0);
  const dataLoadedRef = useRef<boolean>(false);

  // PHASE 1: Splash Screen Timer
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      console.log('Splash screen timer completed, showing loading screen');
      setAppState('loading');
      loadingStartTimeRef.current = Date.now();
    }, SPLASH_DURATION);

    return () => clearTimeout(splashTimer);
  }, []);

  // PHASE 2: Data Loading & Validation
  useEffect(() => {
    // Skip if we're still in splash screen or already finished loading
    if (appState === 'splash' || appState === 'ready') return;

    const validateSession = async () => {
      if (sessionValidatedRef.current) return;

      try {
        console.log('Validating server-side session...');
        const authResult = await dispatch(checkAuthStatus()).unwrap();

        // Determine if user is authenticated after status check
        if (authResult?.isAuthenticated && authResult?.userId) {
          console.log('User is authenticated, checking profile status...');
          await dispatch(checkProfileStatus(authResult.userId)).unwrap();

          // Check onboarding status
          const termsAccepted = await AsyncStorage.getItem('termsAccepted');
          const notificationsSet = await AsyncStorage.getItem('notificationsSet');
          const profileCompleted = await AsyncStorage.getItem('profileCompleted');

          const hasTerms = termsAccepted === 'true';
          const hasNotifs = notificationsSet === 'true';
          const hasProfile = profileCompleted === 'true';

          setHasAcceptedTerms(hasTerms);
          setHasSetNotifications(hasNotifs);
          setLocalProfileComplete(hasProfile);

          // Also check for terms acceptance in profile data
          if (!hasTerms && authResult.userId) {
            try {
              const profileResponse = await dispatch(
                checkProfileStatus(authResult.userId)
              ).unwrap();
              const profileData =
                profileResponse?.profileData || profileResponse?.profileData?.data;

              if (profileData?.termsAndConditionsAccepted) {
                console.log(
                  'Terms accepted in backend but not in AsyncStorage, updating local state'
                );
                await AsyncStorage.setItem('termsAccepted', 'true');
                setHasAcceptedTerms(true);
              }
            } catch (profileError) {
              console.error('Error checking profile for terms acceptance:', profileError);
            }
          }

          // Determine which screen to navigate to
          if (!hasTerms || !hasNotifs) {
            setNavigationTarget('onboarding');
          } else if (!isProfileComplete && !hasProfile) {
            setNavigationTarget('profile');
          } else {
            setNavigationTarget('main');
          }
        } else {
          console.log('User is not authenticated, navigating to auth');
          setNavigationTarget('auth');
        }

        sessionValidatedRef.current = true;
        dataLoadedRef.current = true;

        // Calculate time spent loading data
        const currentTime = Date.now();
        const timeElapsed = currentTime - loadingStartTimeRef.current;

        console.log(
          `Data loaded in ${timeElapsed}ms, minimum loading time is ${MIN_LOADING_DURATION}ms`
        );

        // Ensure minimum loading time for better UX
        if (timeElapsed < MIN_LOADING_DURATION) {
          console.log(
            `Waiting additional ${MIN_LOADING_DURATION - timeElapsed}ms before navigation`
          );
          setTimeout(() => {
            setAppState('ready');
          }, MIN_LOADING_DURATION - timeElapsed);
        } else {
          console.log('Minimum loading time already elapsed, proceeding to navigation');
          setAppState('ready');
        }
      } catch (error) {
        console.error('Session validation failed:', error);

        // Clear auth data if validation fails
        dispatch(logout());
        AsyncStorage.multiRemove(['userToken', 'userId', 'profileCompleted', 'termsAccepted']);

        setNavigationTarget('auth');
        sessionValidatedRef.current = true;
        dataLoadedRef.current = true;

        // Ensure minimum loading time even on error
        const currentTime = Date.now();
        const timeElapsed = currentTime - loadingStartTimeRef.current;

        if (timeElapsed < MIN_LOADING_DURATION) {
          setTimeout(() => {
            setAppState('ready');
          }, MIN_LOADING_DURATION - timeElapsed);
        } else {
          setAppState('ready');
        }
      }
    };

    validateSession();
  }, [appState, dispatch, isAuthenticated, userId, isProfileComplete]);

  // Handle loading screen custom message based on detection state
  const getLoadingMessage = () => {
    if (!dataLoadedRef.current) {
      return 'Connecting to Crew network...';
    } else if (navigationTarget === 'auth') {
      return 'Getting ready for login...';
    } else if (navigationTarget === 'onboarding') {
      return 'Preparing your onboarding...';
    } else if (navigationTarget === 'profile') {
      return 'Loading your profile setup...';
    } else {
      return 'Loading your social feed...';
    }
  };

  // PHASE 3: Session monitoring for errors
  useEffect(() => {
    // Only run this if we're in the ready state and the app is running
    if (appState !== 'ready' || !isAuthenticated) return;

    // Only handle profile errors if the user is authenticated and we're not already handling an error
    if (profileError && !isHandlingErrorRef.current) {
      // Handle session expiration or authorization errors
      if (
        typeof profileError === 'string' &&
        (profileError.includes('Unauthorized') || profileError.includes('expired'))
      ) {
        console.log('Profile unauthorized error detected, handling session invalidation');

        isHandlingErrorRef.current = true;
        dispatch(invalidateSession('Your session has expired. Please log in again.')).finally(
          () => {
            isHandlingErrorRef.current = false;
            setNavigationTarget('auth');
          }
        );
      }
    }
  }, [profileError, isAuthenticated, dispatch, appState]);

  // Update local state if redux state changes
  useEffect(() => {
    if (isProfileComplete && isAuthenticated) {
      setLocalProfileComplete(true);
      AsyncStorage.setItem('profileCompleted', 'true');
    }
  }, [isProfileComplete, isAuthenticated]);

  // For debugging
  console.log('App state:', {
    appState,
    navigationTarget,
    isAuthenticated,
    isProfileComplete,
    localProfileComplete,
    hasAcceptedTerms,
    hasSetNotifications,
  });

  // RENDERING LOGIC

  // 1. Initial splash screen
  if (appState === 'splash') {
    return <SplashScreen />;
  }

  // 2. Interactive loading screen while checking auth and data
  if (appState === 'loading') {
    return <LoadingScreen message={getLoadingMessage()} />;
  }

  // 3. Main navigation tree once everything is loaded and ready
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {navigationTarget === 'auth' ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : navigationTarget === 'onboarding' ? (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : navigationTarget === 'profile' ? (
        <Stack.Screen name="profileSetUp" component={ProfileSetupNavigator} />
      ) : (
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
}
