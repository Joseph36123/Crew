// screens/auth/terms-conditions.tsx
import React, { useState } from 'react';
import {
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/types';
import { CrewButton, Checkbox, Title, Subtitle } from '../../components/atoms';

const { height } = Dimensions.get('window');

type TermsConditionsNavigationProp = StackNavigationProp<AuthStackParamList, 'TermsConditions'>;

const TermsConditionsScreen: React.FC = () => {
  const navigation = useNavigation<TermsConditionsNavigationProp>();

  // State for the two checkboxes
  const [agreedTnC, setAgreedTnC] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  const handleContinue = () => {
    // Add your logic: for example, ensure both are checked before continuing.
    if (!agreedTnC || !agreedPrivacy) {
      console.log('User must agree to T&C and Privacy Policy first.');
      return;
    }
    
    // Navigate to the Notifications screen
    navigation.navigate('Notifications');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-[#191919]">
        {/* Crew Logo: fixed at the top */}
        <Image
          source={require('../../assets/images/logo.png')}
          style={{
            position: 'absolute',
            alignSelf: 'center',
            width: 400,
            height: 400,
            top: height * -0.085,
            zIndex: 1,
          }}
          resizeMode="contain"
        />

        {/* White Container */}
        <View className="absolute top-[30%] z-20 h-[70%] w-full rounded-t-[40px] bg-white">
          <View className="flex-1 items-center px-5 pb-10 pt-8">
            {/* Title */}
            <Title 
              text="Terms & Conditions" 
              containerClassName="mb-4"
            />

            {/* Sub Text */}
            <Subtitle
              text="Agreement to the Terms & Conditions and the Privacy Policy is required to continue with Sign-Up."
              containerClassName="mb-8 w-[326px]"
            />

            {/* Checkbox Container - fixed alignment */}
            <View className="w-full px-8">
              {/* Checkbox for Terms & Conditions */}
              <Checkbox
                checked={agreedTnC}
                onPress={() => setAgreedTnC(!agreedTnC)}
                label="I agree to Terms and Conditions"
                containerClassName="mb-4"
              />

              {/* Checkbox for Privacy Policy */}
              <Checkbox
                checked={agreedPrivacy}
                onPress={() => setAgreedPrivacy(!agreedPrivacy)}
                label="I agree to Privacy Policy"
                containerClassName="mb-10"
              />
            </View>

            {/* Continue Button */}
            <CrewButton
              variant="filled"
              text="Continue"
              color="secondary"
              size="large"
              fullWidth={true}
              onPress={handleContinue}
              disabled={!agreedTnC || !agreedPrivacy}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TermsConditionsScreen;