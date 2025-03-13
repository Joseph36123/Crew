// screens/profile/ProfileBasicInfo.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileSetupStackParamList } from '../../types/types';
import { CrewButton, GenderButton, InfoContainer } from '../../components/atoms';
import { ProfileHeader, ProfileContainer } from '../../components/molecules';
import Slider from '@react-native-community/slider';

type ProfileSetupNavigationProp = StackNavigationProp<ProfileSetupStackParamList, 'ProfileBasicInfo'>;

const { width } = Dimensions.get('window');

const ProfileBasicInfo = () => {
  const navigation = useNavigation<ProfileSetupNavigationProp>();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'nonbinary' | null>(null);
  const [age, setAge] = useState<number>(25);
  const [hometown, setHometown] = useState<string>('');
  const [school, setSchool] = useState<string>('');
  const [culture, setCulture] = useState<string>('');

  const handleContinue = () => {
    // Save the user's profile information
    console.log('Continuing with:', { selectedGender, age, hometown, school, culture });
    
    // Navigate to the ProfilePhoto screen
    navigation.navigate('ProfilePhoto');
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />
      
      <ProfileContainer>
        {/* Title and Subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Let's get you connected</Text>
          <Text style={styles.subtitleText}>Tell us about yourself</Text>
        </View>

        {/* Gender Selection */}
        <InfoContainer>
          <GenderButton 
            gender="male" 
            selectedGender={selectedGender} 
            onSelect={setSelectedGender}
            iconSource={require('../../assets/images/male.png')} 
          />
          <GenderButton 
            gender="nonbinary" 
            selectedGender={selectedGender} 
            onSelect={setSelectedGender}
            iconSource={require('../../assets/images/nonbinary.png')} 
          />
          <GenderButton 
            gender="female" 
            selectedGender={selectedGender} 
            onSelect={setSelectedGender}
            iconSource={require('../../assets/images/female.png')} 
          />
        </InfoContainer>

        {/* Age Slider */}
        <InfoContainer height={63}>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={age}
              onValueChange={setAge}
              minimumTrackTintColor="#AAD3FF"
              maximumTrackTintColor="#EEEEEE"
              thumbTintColor="#AAD3FF"
              step={1}
            />
            <View style={styles.ageIndicator}>
              <Text style={styles.ageText}>{age} Y/O</Text>
            </View>
          </View>
        </InfoContainer>

        {/* Text Input Fields - Editable */}
        <InfoContainer height={63}>
          <TextInput
            style={styles.infoInput}
            placeholder="HOMETOWN"
            placeholderTextColor="#555"
            value={hometown}
            onChangeText={setHometown}
          />
        </InfoContainer>

        <InfoContainer height={63}>
          <TextInput
            style={styles.infoInput}
            placeholder="SCHOOL"
            placeholderTextColor="#555"
            value={school}
            onChangeText={setSchool}
          />
        </InfoContainer>

        <InfoContainer height={63}>
          <TextInput
            style={styles.infoInput}
            placeholder="CULTURE"
            placeholderTextColor="#555"
            value={culture}
            onChangeText={setCulture}
          />
        </InfoContainer>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <CrewButton
            variant="filled"
            text="Continue"
            color="secondary"
            size="large"
            fullWidth={true}
            onPress={handleContinue}
          />
        </View>
      </ProfileContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    marginBottom: 24,
  },
  sliderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensure slider and age indicator are spaced properly
  },
  slider: {
    flex: 0.85, // Extend slider more to the right
    height: 40,
  },
  ageIndicator: {
    width: 65, // Wider to accommodate "Y/O" text
    height: 24,
    backgroundColor: '#AAD3FF',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  ageText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Cairo_500Medium',
    fontSize: 12, // Smaller text to fit "Y/O"
  },
  titleText: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D0F0F',
    marginTop: 5,
    marginBottom: 5,
  },
  subtitleText: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 16, // Adjust this value to change the subtitle font size
    color: '#777',
    marginBottom: 24,
  },
  infoInput: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    width: '100%',
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
});

export default ProfileBasicInfo;