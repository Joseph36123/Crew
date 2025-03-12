import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, Dimensions, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileSetupStackParamList } from '../../types/types';
import { CrewButton, GenderButton, InfoContainer } from '../../components/atoms';
import Slider from '@react-native-community/slider';

type ProfileSetupNavigationProp = StackNavigationProp<ProfileSetupStackParamList, 'ProfileSetupPlaceholder'>;

const { width } = Dimensions.get('window');

// This component is removed as we're simplifying the text fields

const ProfileBasicInfo = () => {
  const navigation = useNavigation<ProfileSetupNavigationProp>();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'nonbinary' | null>(null);
  const [age, setAge] = useState<number>(25);
  const [hometown, setHometown] = useState<string>('');
  const [school, setSchool] = useState<string>('');
  const [culture, setCulture] = useState<string>('');

  const handleContinue = () => {
    // Handle continue logic
    console.log('Continuing with:', { selectedGender, age, hometown, school, culture });
    // Navigate to next screen
    // navigation.navigate('NextScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Top Header Container */}
        <View style={styles.header}>
          {/* Logo with absolute positioning */}
          <Image
            source={require('../../assets/images/logo2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          {/* Header content */}
          <View style={{flex: 1}}></View>
          
          {/* Go Back Button with frame */}
          <View style={styles.goBackButtonContainer}>
            <Text 
              style={styles.goBackText}
              onPress={() => navigation.goBack()}>
              Go back
            </Text>
          </View>
        </View>

        {/* Main Content Container */}
        <View style={styles.mainContainer}>
          {/* Title and Subtitle */}
          {/* Custom Title and Subtitle */}
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
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    width: '100%',
    height: 97,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', 
    paddingHorizontal: 20,
    paddingBottom: 15,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 1,
    elevation: 3,
    position: 'relative', // Needed for absolute positioning of logo
  },
  logo: {
    width: 150,
    height: 60,
    position: 'absolute', // Position the logo absolutely
    bottom: 0, // Adjust this value to move logo up/down independently
    left: 20,
  },
  goBackButtonContainer: {
    width: 92,
    height: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    shadowOpacity: 1,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    overflow: 'hidden', // Ensure text doesn't overflow
  },
  mainContainer: {
    width: width - 40,
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    shadowColor: 'rgba(13, 13, 13, 0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 1,
    elevation: 3,
  },
  titleContainer: {
    marginBottom: 24,
  },
  // Main info container styles removed as we're using the InfoContainer component
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
  goBackText: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
});

export default ProfileBasicInfo;