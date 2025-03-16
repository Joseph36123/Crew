import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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
      <Image
        source={require('../../assets/images/logo2.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={{ flex: 1 }}></View>

      <TouchableOpacity
        style={styles.goBackButtonContainer}
        onPress={handleGoBack}
        activeOpacity={0.7}>
        <View style={styles.goBackInner}>
          <Ionicons name="chevron-back" size={16} color="#0D0F0F" style={styles.backIcon} />
          <Text style={styles.goBackText}>Go back</Text>
        </View>
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
    position: 'relative',
  },
  logo: {
    width: 150,
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 20,
  },
  goBackButtonContainer: {
    minWidth: 92,
    height: 36,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    shadowOpacity: 1,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 18,
    overflow: 'hidden',
    paddingHorizontal: 12,
  },
  goBackInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    marginRight: 4,
  },
  goBackText: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 14,
    color: '#0D0F0F',
    textAlign: 'center',
  },
});

export default ProfileHeader;
