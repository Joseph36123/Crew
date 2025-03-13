// components/molecules/ProfileHeader.tsx
import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface ProfileHeaderProps {
  onGoBack?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onGoBack }) => {
  const navigation = useNavigation();
  
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.header}>
      {/* Logo with absolute positioning */}
      <Image
        source={require('../../assets/images/logo2.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      {/* Header content - empty flex space */}
      <View style={{flex: 1}}></View>
      
      {/* Go Back Button with frame */}
      <TouchableOpacity 
        style={styles.goBackButtonContainer}
        onPress={handleGoBack}
      >
        <Text style={styles.goBackText}>Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  goBackText: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
  },
});

export default ProfileHeader;