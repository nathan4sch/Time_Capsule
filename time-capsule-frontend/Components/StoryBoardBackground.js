import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default ({ children }) => {
  return (
    <LinearGradient
      colors={['#000000', '#E7E7E7', '#E7E7E7', '#000000']}
      start={[0, 0]}
      end={[0, 1]}
      locations={[0, 0.281, 0.711, 1]}
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
