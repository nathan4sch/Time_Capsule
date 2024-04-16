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
              state.index === index && styles.activeTabButton,
            ]}
            onPress={() => navigation.navigate(tab.route)}
          >
            <Feather name={tab.icon} size={24} color="black" />
            <Text style={styles.tabTitle}>{tab.title}</Text>
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
});

export default BottomTab;
