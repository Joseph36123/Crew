// src/store/slices/profileSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { profileService } from '../../services/api';
import { ProfileState } from 'store/types';

// Initial state
const initialState: ProfileState = {
  isProfileComplete: false,
  isLoading: false,
  profileData: null,
  error: null,
};

// Async thunks for profile actions
export const checkProfileStatus = createAsyncThunk(
  'profile/checkStatus',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfileStatus(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'profile/getProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await profileService.getUserProfile(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const completeProfile = createAsyncThunk(
  'profile/complete',
  async (
    { userId, profileData }: { userId: string; profileData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileService.completeProfile(userId, profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Create the profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    setProfileComplete: (state, action: PayloadAction<boolean>) => {
      state.isProfileComplete = action.payload;
    },
    resetProfileState: () => initialState,
  },
  extraReducers: (builder) => {
    // Check profile status
    builder.addCase(checkProfileStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(checkProfileStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isProfileComplete = action.payload.data.isComplete;
    });
    builder.addCase(checkProfileStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get user profile
    builder.addCase(getUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profileData = action.payload.data.profile;
      state.isProfileComplete = action.payload.data.isComplete;
    });
    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Complete profile
    builder.addCase(completeProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(completeProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isProfileComplete = true;
      state.profileData = { ...state.profileData, ...action.payload.data.profile };
    });
    builder.addCase(completeProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearProfileError, setProfileComplete, resetProfileState } = profileSlice.actions;

export default profileSlice.reducer;
