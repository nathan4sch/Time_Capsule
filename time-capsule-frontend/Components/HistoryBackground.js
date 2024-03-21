import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

export default ({ children }) => {
  return (
    /*
    <LinearGradient
      colors={['#FFFFFF', '#FFFFFF', '#FFFFFF']}
      //colors={['#000000', '#FFFFFF', '#000000']}
      start={[0, 0]}
      end={[0, 1]}
      style={styles.background}
    >
      {children}
    </LinearGradient>
    */

    // SVG brick background
    <View style={styles.background}>
      <Svg height="100%" width="100%" viewBox="0 0 168 264" style={styles.background}>
        <G id="Page-1" fill="none" fillRule="evenodd">
          <G id="brick-wall" fill="#ececec" fillOpacity="0.4">
            <G transform="translate(0 0)">
				      <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(42 0)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(84 0)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(126 0)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>

            <G transform="translate(0 44)">
				      <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(42 44)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(84 44)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(126 44)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>

            <G transform="translate(0 88)">
				      <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(42 88)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(84 88)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(126 88)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>

            <G transform="translate(0 132)">
				      <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(42 132)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(84 132)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(126 132)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>

            <G transform="translate(0 176)">
				      <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(42 176)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(84 176)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(126 176)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>

            <G transform="translate(0 220)">
				      <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(42 220)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(84 220)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(126 220)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>

            <G transform="translate(0 264)">
				      <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(42 264)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(84 264)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
            <G transform="translate(126 264)">
              <Path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/>
            </G>
          </G>
        </G>
      </Svg>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
  },
});
