import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const gifOpacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Scale animation
    scale.value = withTiming(1.2, { duration: 1500 });

    // Fade out animation
    setTimeout(() => {
      gifOpacity.value = withTiming(0, { duration: 1000 });
    }, 3500);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: gifOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.gifContainer}>
        <Image source={require('../assets/gifs/ppp.gif')} style={styles.gif} contentFit="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifContainer: {
    width: '70%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    width: '100%',
    height: '100%',
  },
});
