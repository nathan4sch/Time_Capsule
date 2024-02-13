import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default ({children}) => {
  return (
    <LinearGradient colors={['rgba(0, 245, 186, 0.3)', '#000000']} style={styles.background}>
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
        backgroundColor: 'rgba(0, 245, 186, 0.3)',
    },
});
