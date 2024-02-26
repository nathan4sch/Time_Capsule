import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default ({ children }) => {
  return (
    <LinearGradient
      colors={['rgba(0, 0, 0, 0.5)', '#000000', '#000000', 'rgba(0, 0, 0, 0.61)']}
      style={styles.background}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
  },
});
