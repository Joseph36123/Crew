import React from 'react';
import { TouchableOpacity, Image, View, StyleSheet, ImageSourcePropType } from 'react-native';

interface GenderButtonProps {
  gender: 'male' | 'female' | 'nonbinary';
  selectedGender: 'male' | 'female' | 'nonbinary' | null;
  onSelect: (gender: 'male' | 'female' | 'nonbinary') => void;
  iconSource: ImageSourcePropType;
}

const GenderButton: React.FC<GenderButtonProps> = ({ 
  gender, 
  selectedGender, 
  onSelect, 
  iconSource 
}) => {
  const isSelected = gender === selectedGender;
  
  return (
    <TouchableOpacity
      onPress={() => onSelect(gender)}
      style={[styles.genderButton, isSelected && styles.selectedGenderButton]}>
      <Image 
        source={iconSource} 
        style={styles.genderIcon} 
        resizeMode="contain" 
      />
      {isSelected && (
        <View style={styles.selectedOverlay} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  genderButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  selectedGenderButton: {
    borderColor: '#AAD3FF',
    borderWidth: 2,
  },
  genderIcon: {
    width: 30,
    height: 30,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(170, 211, 255, 0.3)',
    borderRadius: 25,
  },
});

export default GenderButton;