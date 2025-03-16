import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from 'services/api';
import { AuthState, initialState } from 'store/types';
import { Alert } from 'react-native';

// Helper function to handle phone number formatting
const formatPhoneNumber = (phoneNumber: string) => {
  // If phone already has a + prefix, leave it as is
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }

  // If phone starts with a 0, assume it's a local number and add +250
  if (phoneNumber.startsWith('0')) {
    return `+250${phoneNumber.substring(1)}`;
  }

  // Otherwise, just return the phone number as is
  return phoneNumber;
};

// async thunk for auth actions
export const initiateLogin = createAsyncThunk(
  'auth/initiateLogin',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      // Format the phone number properly
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('Using formatted phone:', formattedPhone);

      // Return the full response from the API
      const response = await authService.login(formattedPhone);
      console.log('Login thunk received response:', response);

      // Add the phone number for reference
      return {
        data: response,
        phoneNumber: formattedPhone,
        success: response && response.data.success !== undefined ? response.data.success : true,
      };
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(error);
    }
  }
);

export const initiateRegister = createAsyncThunk(
  'auth/initiateRegister',
  async (userData: { fullName: string; phoneNumber: string }, { rejectWithValue }) => {
    try {
      // Format the phone number properly
      const formattedPhone = formatPhoneNumber(userData.phoneNumber);
      console.log('Using formatted phone for registration:', formattedPhone);

      // Create updated user data with formatted phone
      const updatedUserData = {
        ...userData,
        phoneNumber: formattedPhone,
      };

      // Return the full response from the API
      const response = await authService.register(updatedUserData);

      return {
        data: response,
        phoneNumber: formattedPhone,
        fullName: userData.fullName,
        // Add explicit success flag based on response
        success: response?.data?.success !== undefined ? response.data.success : true,
      };
    } catch (error) {
      console.error('Register error:', error);
      return rejectWithValue(error);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (
    { phoneNumber, otp }: { phoneNumber: string; otp: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      const authMode = auth.currentAuthMode;

      // Format the phone number properly
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('Using formatted phone for OTP verification:', formattedPhone);

      // Get the full response from the API
      const response = await authService.verifyOTP(formattedPhone, otp);
      console.log('OTP verification response:', JSON.stringify(response, null, 2));

      // Save token and userId to AsyncStorage if they exist
      if (response?.data?.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
      }

      if (response?.data?.userId) {
        await AsyncStorage.setItem('userId', response.data.userId);
      }

      // Return the full response plus authMode
      return {
        data: response,
        authMode,
        // Add explicit success flag based on response
        success: response && response.data.success !== undefined ? response.data.success : true,
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return rejectWithValue(error);
    }
  }
);

export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('Using formatted phone for resend OTP:', formattedPhone);

      // Get the response
      const response = await authService.resendOTP(formattedPhone);
      console.log('Resend OTP API response:', response);
      return {
        data: response,
        success: response?.data?.success || (response?.data && response.data.success) || true,
      };
    } catch (error) {
      console.error('Resend OTP error:', error);
      return rejectWithValue(error);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');

      return {
        token,
        userId,
        isAuthenticated: !!token,
        success: true,
      };
    } catch (error) {
      console.error('Check auth status error:', error);
      return rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();

    const keysToRemove = ['userToken', 'userId', 'refreshToken', 'tokenExpiry'];

    const removePromises = keysToRemove.map((key) => {
      if (allKeys.includes(key)) {
        return AsyncStorage.removeItem(key);
      }
      return Promise.resolve();
    });

    await Promise.all(removePromises);
    console.log('User logged out, auth data cleared from storage');

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: true };
  }
});

export const invalidateSession = createAsyncThunk(
  'auth/invalidateSession',
  async (message: string = 'Your session has expired. Please log in again.', { dispatch }) => {
    try {
      Alert.alert('Session Expired', message, [{ text: 'OK' }]);
      await dispatch(logout());

      return { success: true };
    } catch (error) {
      console.error('Session invalidation error:', error);
      return { success: true };
    }
  }
);

// create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTemPhoneNumber: (state, action: PayloadAction<string>) => {
      state.tempPhoneNumber = action.payload;
    },

    setTemFullName: (state, action: PayloadAction<string>) => {
      state.tempFullName = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    setAuthMode: (state, action: PayloadAction<'login' | 'register' | null>) => {
      state.currentAuthMode = action.payload;
    },

    resetAuthState: (state) => {
      state.tempPhoneNumber = null;
      state.tempFullName = null;
      state.error = null;
      state.currentAuthMode = null;
      state.otpSent = false;
    },
  },

  extraReducers: (builder) => {
    // initiate Login
    builder.addCase(initiateLogin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(initiateLogin.fulfilled, (state, action) => {
      console.log('Login fulfilled with payload:', action.payload);
      state.isLoading = false;

      // Always handle as successful unless explicitly false
      if (action.payload?.success !== false) {
        // Set OTP sent flag
        state.otpSent = true;
        // Store phone number
        state.tempPhoneNumber = action.payload?.phoneNumber || null;
        // Set auth mode
        state.currentAuthMode = 'login';
        // Clear any errors
        state.error = null;

        console.log('Login successful, updated state:', {
          otpSent: state.otpSent,
          tempPhoneNumber: state.tempPhoneNumber,
          currentAuthMode: state.currentAuthMode,
        });
      } else {
        state.error = 'Failed to send verification code';
        console.log('Login unsuccessful, error set');
      }
    });

    builder.addCase(initiateLogin.rejected, (state, action) => {
      console.log('Login rejected with payload:', action.payload);
      state.isLoading = false;
      state.error = action.payload as string;
      state.otpSent = false;
    });

    // initiate Register
    builder.addCase(initiateRegister.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(initiateRegister.fulfilled, (state, action) => {
      state.isLoading = false;

      // Handle as successful unless explicitly false
      if (action.payload?.success !== false) {
        state.otpSent = true;

        // Store registration information
        state.tempPhoneNumber = action.payload?.phoneNumber || null;
        state.tempFullName = action.payload?.fullName || null;

        // Set the auth mode
        state.currentAuthMode = 'register';
        // Clear any errors
        state.error = null;
      } else {
        state.error = 'Failed to register';
      }
    });

    builder.addCase(initiateRegister.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.otpSent = false;
    });

    // verify OTP
    builder.addCase(verifyOTP.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(verifyOTP.fulfilled, (state, action) => {
      state.isLoading = false;

      // Handle as successful unless explicitly false
      if (action.payload?.success !== false) {
        state.isAuthenticated = true;

        // Try to find token and userId in the response
        const responseData = action.payload?.data?.data;

        if (responseData) {
          state.token = responseData.token || null;
          state.userId = responseData.userId || null;
        }

        // Reset temporary state but keep auth mode for flow control
        state.tempPhoneNumber = null;
        state.tempFullName = null;
        state.otpSent = false;
        state.error = null;
      } else {
        state.isAuthenticated = false;
        state.error = 'OTP verification failed';
      }
    });

    builder.addCase(verifyOTP.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });
    // Resend OTP
    builder.addCase(resendOTP.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(resendOTP.fulfilled, (state) => {
      state.isLoading = false;
      // No need to update other state for resend OTP
      state.error = null;
    });

    builder.addCase(resendOTP.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Check Auth Status
    builder.addCase(checkAuthStatus.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(checkAuthStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.token = action.payload.token;
      state.userId = action.payload.userId || null;
    });

    builder.addCase(checkAuthStatus.rejected, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.userId = null;
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userId = null;
      state.tempPhoneNumber = null;
    });

    builder.addCase(invalidateSession.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userId = null;
      state.tempPhoneNumber = null;
      state.tempFullName = null;
      state.otpSent = false;
      state.error = null;
      state.currentAuthMode = null;
    });
  },
});

export const { setTemPhoneNumber, setTemFullName, clearError, setAuthMode, resetAuthState } =
  authSlice.actions;

export default authSlice.reducer;
