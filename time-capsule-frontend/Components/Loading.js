import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native'; // Import ActivityIndicator
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from "../Components/lightBackButton";

const Loading = ({navigation}) => {
  const spinValue = useRef(new Animated.Value(0)).current; // Create a ref for the animated value

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 750,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(500),
      ])
    ).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

    return (
      <LinearGradient
      colors={['#000000', '#F2F2F2', '#000000']}
      start={[0, 0]}
      end={[0, 1]}
      locations={[0, 0.5, 1]}
      style={styles.background}
    >
        <BackButton onPress={() => navigation.goBack()} />
        <Animated.Image style={[styles.icon, { transform: [{ rotate: spin }] }]} source={require('../icons/loading-.png')} />
        <View style={styles.LoadingStatement}>
          <Text style={styles.buttonText}>Generating Capsule...</Text>
        </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    alignItems: 'center',
  },
LoadingStatement: {
  position: 'relative',
  top: '49%',
  alignSelf: 'center',
  alignItems: 'center',
},
buttonText: {
    color: 'black',
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
},
icon: {
    position: 'absolute',
    top: '35%',
    height: 120,
    width: 120,
    aspectRatio: 1,
},
});

export default Loading;