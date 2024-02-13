import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default ({ children }) => {
  return (
    <LinearGradient
      colors={['#000000', '#FFFFFF', '#000000']}
      start={[0, 0]}
      end={[0, 1]}
      style={styles.background}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
  },
});
