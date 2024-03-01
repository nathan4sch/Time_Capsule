import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const PageNavBar = ({ onBackPress, title }) => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={onBackPress} style={styles.backArrowContainer}>
      <Image style={styles.backArrowIconContainer} source={require('../icons/lightbackbutton-.png')} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.placeholder}/>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 110, // Adjust the height as needed
    width: '100%',
    paddingHorizontal: 16, // Side padding
    backgroundColor: 'transparent', // Change the background color as needed
    elevation: 4, // Adds shadow for Android
    shadowOpacity: 0.1, // Adds shadow for iOS
    shadowRadius: 10,
    shadowColor: '#000',
    shadowOffset: { height: 0, width: 0 },
    paddingBottom: 10,
  },
  backArrowContainer: {
    padding: 10, // Makes it easier to touch
  },
  backArrowIconContainer: {
    position: 'relative',
    height: 25,
    width: 25,
  },
  titleContainer: {
    position: 'absolute', // Position the title container absolutely to center it
    left: 100,
    right: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20, // Adjust the font size as needed
    fontWeight: 'bold', // Makes the title bold
    padding: 10,
  },
  placeholder: {
    width: 40, // Should be approximately the same size as the back arrow container to balance the title
  },
});

export default PageNavBar;