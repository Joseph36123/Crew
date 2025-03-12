import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface InfoContainerProps {
  children: React.ReactNode;
  height?: number;
  style?: ViewStyle;
}

const InfoContainer: React.FC<InfoContainerProps> = ({ 
  children, 
  height = 79,
  style,
}) => {
  return (
    <View style={[
      styles.container, 
      { height },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    paddingVertical: 6,
    marginBottom: 16,
    width: '100%',
    backgroundColor: 'rgba(242, 242, 242, 0.95)',
    borderRadius: 100,
  },
});

export default InfoContainer;