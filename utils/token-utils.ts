import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';
import { Alert } from 'react-native';
import { AppDispatch } from '../store';
import { invalidateSession } from '../store/slices/authSlice';

const MAX_RETRIES = 2;

const RETRY_DELAY = 2000;
const VALIDATION_TIMEOUT = 5000;

/**
 * Validates the user's token with retries for intermittent connectivity issues
 * @param dispatch Redux dispatch function
 * @returns true if token is valid, false otherwise
 */
export const validateTokenWithRetry = async (dispatch: AppDispatch): Promise<boolean> => {
  let retryCount = 0;

  const performValidation = async (): Promise<boolean> => {
    try {
      await authService.validateToken();
      console.log('Token validation successful');
      return true;
    } catch (error: any) {
      console.log('Token validation attempt failed:', error);

      if (error.response && error.response.status === 401) {
        console.log('Token is invalid (401 Unauthorized)');
        return false;
      }

      if (error.message === 'User ID not found in storage') {
        console.log('User ID not found, cannot validate token');
        return false;
      }

      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.log(`Retrying token validation (${retryCount}/${MAX_RETRIES})...`);

        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return performValidation();
      }

      console.log('Token validation failed after all retry attempts');
      return false;
    }
  };

  const isValid = await performValidation();

  if (!isValid) {
    await dispatch(invalidateSession('Your session has expired. Please log in again.'));
  }

  return isValid;
};

/**
 * Checks if a token exists in AsyncStorage
 * @returns true if token exists, false otherwise
 */
export const hasToken = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem('userToken');
  return token !== null;
};
