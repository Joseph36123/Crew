import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const gifOpacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Scale animation
    scale.value = withTiming(1.2, { duration: 1000 });

    // Fade out animation
    setTimeout(() => {
      gifOpacity.value = withTiming(0, { duration: 500 });
    }, 2500);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: gifOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/gifs/ppp.gif')}
        style={[styles.fullScreenGif, animatedStyle]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  fullScreenGif: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});
