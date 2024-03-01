import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';

const BackButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.backButtonTop} onPress={onPress}>
        <Image style={styles.arrowIconContainer} source={require('../icons/lightbackarrow-.png')} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    backButtonTop: {
      position: 'absolute',
      top: 30,
      left: 10,
      width: 45,
      height: 45,
    },
    arrowIconContainer: {
      position: 'absolute',
      top: 15,
      left: 10,
      height: 25,
      width: 25,
    },
  });

export default BackButton;