// components/molecules/ProfileContainer.tsx
import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

interface ProfileContainerProps {
  children: React.ReactNode;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({ children }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          {children}
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
});

export default ProfileContainer;