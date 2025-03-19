import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';

type LoadingScreenProps = {
  message?: string;
  showLogo?: boolean;
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Connecting to Crew network...',
  showLogo = true,
}) => {
  // Animation value for fade in
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // State for dot animation instead of Animated.Value
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Manual dot animation using setInterval
    const dotInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === '') return '.';
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '';
      });
    }, 500);

    // Clean up interval
    return () => clearInterval(dotInterval);
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      {showLogo && (
        <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
          {/* If you have a Lottie animation file, use it here */}
          <LottieView
            source={require('../../assets/animations/connecting.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </Animated.View>
      )}

      <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
        <Text style={styles.loadingText}>
          {message}
          {dots}
        </Text>
        <Text style={styles.subText}>We're getting everything ready for you</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  textContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Cairo_600SemiBold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    fontFamily: 'Cairo_400Regular',
    color: '#777',
    textAlign: 'center',
  },
});

export default LoadingScreen;
