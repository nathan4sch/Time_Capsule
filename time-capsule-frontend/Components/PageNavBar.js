import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const PageNavBar = ({ onBackPress, title, showBackButton }) => {
  return (
    <View style={styles.navbar}>
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress} style={styles.backArrowContainer}>
          <Image style={styles.backArrowIconContainer} source={require('../icons/lightbackbutton-.png')} />
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.placeholder}/>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 130,
    width: '100%',
    paddingHorizontal: 16,
    backgroundColor: 'black',
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: '#000',
    shadowOffset: { height: 0, width: 0 },
    paddingBottom: 20,
  },
  backArrowContainer: {
    padding: 10,
  },
  backArrowIconContainer: {
    position: 'relative',
    height: 25,
    width: 25,
  },
  titleContainer: {
    position: 'absolute',
    left: 100,
    right: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold', 
    padding: 10,
    color: 'white',
  },
  placeholder: {
    width: 40, 
  },
});

export default PageNavBar;
