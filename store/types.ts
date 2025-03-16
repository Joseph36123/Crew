export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  userId: string | null;
  tempPhoneNumber: string | null; // For OTP verification flow
  tempFullName: string | null; // For registration flow
  error: string | null;
  otpSent: boolean;
  currentAuthMode: 'login' | 'register' | null;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  token: null,
  userId: null,
  tempPhoneNumber: null,
  tempFullName: null,
  error: null,
  otpSent: false,
  currentAuthMode: null,
};

// Define interface for profile data
export interface ILocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}
export interface ProfileData {
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  email?: string;
  hometown?: string;
  school?: string;
  culture?: string;
  vibes?: any[];
  hobbies?: any[];
  scenes?: any[];
  profileCompleted?: boolean;
}

export interface PreferenceItem {
  _id: string;
  title: string;
  imageUrl: string;
}

// Define the profile state
export interface ProfileState {
  isProfileComplete: boolean;
  isLoading: boolean;
  profileData: ProfileData | null;
  error: string | null;
  vibes: PreferenceItem[];
  scenes: PreferenceItem[];
  hobbies: PreferenceItem[];

  selectedVibes: string[];
  selectedScenes: string[];
  selectedHobbies: string[];
}
