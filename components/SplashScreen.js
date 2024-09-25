import React from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
const logo = require('../assets/Figma Icon.png')
const SplashScreen = ({ fadeAnim }) => {
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image
        source={logo}
        style={styles.logo}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default SplashScreen;