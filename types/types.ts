export type RootStackParamList = {
  TabNavigator: undefined;
  Modal: undefined;
  Auth: undefined;
  Onboarding: undefined;
  profileSetUp: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Signin: undefined;
  Signup: undefined;
  OTPVerification: {
    phoneNumber: string;
  };
  TermsConditions: undefined;
  Notifications: undefined;
};

export type OnboardingStackParamList = {
  TermsConditions: undefined;
  Notifications: undefined;
};

export type ProfileSetupStackParamList = {
  ProfileBasicInfo: undefined;
  ProfilePhoto: undefined;
  VibeSelection: undefined;
  SceneSelection: undefined;
  HobbiesSelection: undefined;
  PreferenceSummary: undefined;
  // Add other profile setup screens as needed:
  // ProfilePreferences: undefined;
  // ProfileAvatar: undefined;
};

export interface PhoneInputFieldProps {
  value: string;
  onChangeText: (text: string, formattedText: string) => void;
  onValidChange?: (isValid: boolean) => void;
  containerClassName?: string;
  placeholder?: string;
  defaultCode?: string;
}

export interface ProfileData {
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  email?: string;
  school?: string;
  culture?: string;
  hometown?: string;
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
