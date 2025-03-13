// screens/profile/ProfilePhoto.tsx
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert, Platform, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { ProfileSetupStackParamList } from '../../types/types';
import { ProfileHeader } from '../../components/molecules';
import { ProfileContainer } from '../../components/molecules';
import { CrewButton } from '../../components/atoms';

type ProfilePhotoNavigationProp = StackNavigationProp<ProfileSetupStackParamList, 'ProfilePhoto'>;

const ProfilePhoto = () => {
  const navigation = useNavigation<ProfilePhotoNavigationProp>();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Request permissions when component mounts
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        // Check camera permissions
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Camera permission is required to take a profile picture',
            [{ text: 'OK' }]
          );
        }

        // Check media library permissions
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (mediaStatus !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Media library access is required to select a profile picture',
            [{ text: 'OK' }]
          );
        }
      }
    })();
  }, []);

  // Handle taking a photo with camera
  const handleTakePhoto = async () => {
    try {
      // Check permission first
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to take a photo');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  // Handle choosing photo from library
  const handleChooseFromLibrary = async () => {
    try {
      // Check permission first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Media library access is required to select a profile picture');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };

  // Handle continue button press
  const handleContinue = () => {
    // Here we would typically save the profile image to state/backend
    // For now, let's just log it and navigate to the next screen
    console.log('Profile image selected:', profileImage);
    
    // Navigate to the next screen in the flow
    // Uncomment when you've added the next screen to the navigator
    // navigation.navigate('NextProfileScreen');
    
    // For now, we'll just show an alert
    Alert.alert('Success', 'Profile photo saved successfully!');
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />
      
      <ProfileContainer>
        {/* Custom Title and Subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Set your profile photo</Text>
          <Text style={styles.subtitleText}>This will be displayed on your profile</Text>
        </View>
        
        {/* Concentric Circles */}
        <View style={styles.circlesContainer}>
          {/* Largest circle (bottom layer) */}
          <Image 
            source={require('../../assets/images/circle1.png')} 
            style={styles.circle1} 
            resizeMode="contain"
          />
          
          {/* Middle circle */}
          <Image 
            source={require('../../assets/images/circle2.png')} 
            style={styles.circle2} 
            resizeMode="contain"
          />
          
          {/* Smallest circle (top layer) */}
          <View style={styles.circle3Container}>
            <Image 
              source={require('../../assets/images/circle3.png')} 
              style={styles.circle3} 
              resizeMode="contain"
            />
            
            {/* Profile image preview (if selected) */}
            {profileImage && (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage} 
              />
            )}
            
            {/* Camera icon */}
            <TouchableOpacity 
              style={styles.cameraIconContainer}
              onPress={handleTakePhoto}
            >
              <Image 
                source={require('../../assets/images/camera.png')} 
                style={styles.cameraIcon} 
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {/* Choose from Camera Roll Button */}
          <CrewButton
            variant="outlined"
            text="Choose from Camera Roll"
            color="primary"
            size="large"
            fullWidth={true}
            onPress={handleChooseFromLibrary}
            className="mb-4"
          />
          
          {/* Continue Button */}
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
  titleText: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D0F0F',
    marginTop: 20,
    marginBottom: 5,
  },
  subtitleText: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 16,
    color: '#777',
    marginBottom: 24,
  },
  circlesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    marginVertical: 20,
    position: 'relative',
  },
  circle1: {
    width: 250,
    height: 250,
    position: 'absolute',
    zIndex: 1,
  },
  circle2: {
    width: 160,
    height: 160,
    position: 'absolute',
    zIndex: 2,
  },
  circle3Container: {
    position: 'absolute',
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle3: {
    width: 90,
    height: 90,
    position: 'absolute',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    position: 'absolute',
  },
  cameraIconContainer: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
  cameraIcon: {
    width: 30,
    height: 30,
  },
  buttonContainer: {
    marginTop: 30,
    width: '100%',
  },
});

export default ProfilePhoto;