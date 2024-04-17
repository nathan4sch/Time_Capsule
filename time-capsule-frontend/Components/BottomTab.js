// BottomTab.js

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const BottomTab = ({ navigation, state }) => {
  const tabOptions = [
    { title: 'History', icon: 'clipboard', route: 'History' },
    { title: 'Home', icon: 'home', route: 'Main' },
    { title: 'StoryBoard', icon: 'aperture', route: 'StoryBoard' },
  ];

  return (
    <View style={styles.tabContainer}>
      <View style={styles.container}>
        {tabOptions.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabButton,
            ]}
            onPress={() => navigation.navigate(tab.route)}
          >
            <Feather
              name={tab.icon}
              size={state.index === index ? 30 : 24}
              color={state.index === index ? 'black' : 'grey'}
              style={state.index === index ? styles.boldIcon : null}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tabButton: {
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
  },
  tabTitle: {
    marginTop: 3,
    fontSize: 12,
  },
  boldIcon: {
    fontWeight: 'bold',
  },
});

export default BottomTab;
