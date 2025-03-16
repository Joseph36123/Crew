import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { profileService } from '../../services/api';
import { ProfileState, ProfileData } from '../types';
import { PreferenceItem, ProfileUpdateData } from '../../services/profileService';

// Enhanced initial state with preferences
const initialState: ProfileState = {
  isProfileComplete: false,
  isLoading: false,
  profileData: null,
  error: null,
  vibes: [],
  scenes: [],
  hobbies: [],
  selectedVibes: [],
  selectedScenes: [],
  selectedHobbies: [],
};

// Existing thunks
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

// New thunks for preferences
export const fetchVibes = createAsyncThunk('profile/fetchVibes', async (_, { rejectWithValue }) => {
  try {
    const response = await profileService.getVibes();
    return response;
  } catch (error) {
    console.error('Fetch vibes error:', error);
    return rejectWithValue(error);
  }
});

export const fetchScenes = createAsyncThunk(
  'profile/fetchScenes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getScenes();
      return response;
    } catch (error) {
      console.error('Fetch scenes error:', error);
      return rejectWithValue(error);
    }
  }
);

export const fetchHobbies = createAsyncThunk(
  'profile/fetchHobbies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getHobbies();
      return response;
    } catch (error) {
      console.error('Fetch hobbies error:', error);
      return rejectWithValue(error);
    }
  }
);

// Incremental profile updates
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (
    { userId, profileData }: { userId: string; profileData: ProfileUpdateData },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileService.updateProfile(userId, profileData);
      return {
        profileData: response.data,
        success: response?.data?.success,
      };
    } catch (error) {
      console.error('Update profile error:', error);
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
      state.selectedVibes = [];
      state.selectedScenes = [];
      state.selectedHobbies = [];
    },
    clearProfileError: (state) => {
      state.error = null;
    },
    // New reducers for preferences
    setSelectedVibes: (state, action: PayloadAction<string[]>) => {
      state.selectedVibes = action.payload;
    },
    setSelectedScenes: (state, action: PayloadAction<string[]>) => {
      state.selectedScenes = action.payload;
    },
    setSelectedHobbies: (state, action: PayloadAction<string[]>) => {
      state.selectedHobbies = action.payload;
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

        // Also set selected items if profileData includes them
        if (action.payload.profileData) {
          const data = action.payload.profileData;

          if (data.vibes) {
            state.selectedVibes = data.vibes.map((v: any) =>
              typeof v === 'string' ? v : v.id || v._id
            );
          }

          if (data.scenes) {
            state.selectedScenes = data.scenes.map((s: any) =>
              typeof s === 'string' ? s : s.id || s._id
            );
          }

          if (data.hobbies) {
            state.selectedHobbies = data.hobbies.map((h: any) =>
              typeof h === 'string' ? h : h.id || h._id
            );
          }
        }

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

        // Also set selected items if profileData includes them
        if (action.payload.profileData) {
          const data = action.payload.profileData;

          if (data.vibes) {
            state.selectedVibes = data.vibes.map((v: any) =>
              typeof v === 'string' ? v : v.id || v._id
            );
          }

          if (data.scenes) {
            state.selectedScenes = data.scenes.map((s: any) =>
              typeof s === 'string' ? s : s.id || s._id
            );
          }

          if (data.hobbies) {
            state.selectedHobbies = data.hobbies.map((h: any) =>
              typeof h === 'string' ? h : h.id || h._id
            );
          }
        }

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

    // Fetch Vibes
    builder.addCase(fetchVibes.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchVibes.fulfilled, (state, action) => {
      state.isLoading = false;
      state.vibes = action.payload.data || [];
    });
    builder.addCase(fetchVibes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Scenes
    builder.addCase(fetchScenes.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchScenes.fulfilled, (state, action) => {
      state.isLoading = false;
      state.scenes = action.payload.data || [];
    });
    builder.addCase(fetchScenes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Hobbies
    builder.addCase(fetchHobbies.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchHobbies.fulfilled, (state, action) => {
      state.isLoading = false;
      state.hobbies = action.payload.data || [];
    });
    builder.addCase(fetchHobbies.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.isLoading = false;

      if (action.payload?.success !== false) {
        state.profileData = action.payload.profileData;

        // If the update included vibes, scenes, or hobbies, ensure selected arrays are up to date
        const data = action.payload.profileData;
        if (data.vibes) {
          state.selectedVibes = data.vibes.map((v: any) =>
            typeof v === 'string' ? v : v.id || v._id
          );
        }

        if (data.scenes) {
          state.selectedScenes = data.scenes.map((s: any) =>
            typeof s === 'string' ? s : s.id || s._id
          );
        }

        if (data.hobbies) {
          state.selectedHobbies = data.hobbies.map((h: any) =>
            typeof h === 'string' ? h : h.id || h._id
          );
        }
      } else {
        state.error = 'Failed to update profile';
      }
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  resetProfileState,
  clearProfileError,
  setSelectedVibes,
  setSelectedScenes,
  setSelectedHobbies,
} = profileSlice.actions;

export default profileSlice.reducer;
