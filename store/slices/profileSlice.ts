import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { profileService } from '../../services/api';
import { ProfileState, ProfileData } from '../types';

// Initialize profile state
const initialState: ProfileState = {
  isProfileComplete: false,
  isLoading: false,
  profileData: null,
  error: null,
};

// Async thunk for checking profile status
export const checkProfileStatus = createAsyncThunk(
  'profile/checkStatus',
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log('Checking profile status for user:', userId);
      const response = await profileService.getProfileStatus(userId);
      console.log('Profile status check response:', response);

      return {
        userId,
        isProfileComplete: response.data.profileCompleted,
        profileData: response.data,
        success: response?.data?.success,
      };
    } catch (error) {
      console.error('Profile status check error:', error);
      return rejectWithValue(error);
    }
  }
);

// Async thunk for getting full profile
export const getUserProfile = createAsyncThunk(
  'profile/getUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await profileService.getUserProfile(userId);
      return {
        profileData: response.data,
        success: response?.data?.success,
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      return rejectWithValue(error);
    }
  }
);

// Async thunk for completing profile
export const completeProfile = createAsyncThunk(
  'profile/completeProfile',
  async (
    { userId, profileData }: { userId: string; profileData: FormData },
    { rejectWithValue }
  ) => {
    try {
      console.log('Completing profile for user:', userId);
      const response = await profileService.completeProfile(userId, profileData);
      console.log('Complete profile response:', response);

      return {
        profileData: response.data,
        success: response?.data?.success,
      };
    } catch (error) {
      console.error('Complete profile error:', error);
      return rejectWithValue(error);
    }
  }
);

// Create the profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.isProfileComplete = false;
      state.profileData = null;
      state.error = null;
    },
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Check Profile Status
    builder.addCase(checkProfileStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(checkProfileStatus.fulfilled, (state, action) => {
      state.isLoading = false;

      if (action.payload?.success !== false) {
        state.isProfileComplete = action.payload.isProfileComplete;
        state.profileData = action.payload.profileData;
        state.error = null;

        console.log('Profile status updated:', {
          isProfileComplete: state.isProfileComplete,
          profileData: state.profileData,
        });
      } else {
        state.error = 'Failed to get profile status';
      }
    });

    builder.addCase(checkProfileStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get User Profile
    builder.addCase(getUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.isLoading = false;

      if (action.payload?.success !== false) {
        state.profileData = action.payload.profileData;
        state.error = null;
      } else {
        state.error = 'Failed to get user profile';
      }
    });

    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Complete Profile
    builder.addCase(completeProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(completeProfile.fulfilled, (state, action) => {
      state.isLoading = false;

      if (action.payload?.success !== false) {
        state.isProfileComplete = true;
        state.profileData = action.payload.profileData;
        state.error = null;
      } else {
        state.error = 'Failed to complete profile';
      }
    });

    builder.addCase(completeProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetProfileState, clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
