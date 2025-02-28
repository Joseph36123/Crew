// types/types.ts
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  TabNavigator: undefined;
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