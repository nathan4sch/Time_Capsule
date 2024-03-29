import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  StyleSheet, Text, View, Image, ScrollView, Alert, ActivityIndicator, Button, Dimensions
} from 'react-native'; // Import ActivityIndicator
import BackButton from "../Components/lightBackButton";
import BlackBackground from "../Components/BlackBackground";
import * as MediaLibrary from 'expo-media-library';
import { useGlobalContext } from "../context/globalContext";
import * as ImageManipulator from 'expo-image-manipulator';
import ViewShot from 'react-native-view-shot';
import axios from 'axios';

const Photos = ({ navigation }) => {
  const { BASE_S3_URL, getSpotifyTopSong, createCapsule, curUser, getCapsule, postPhoto, setSnapshotKey } = useGlobalContext();
  //const [photos, setPhotos] = useState([]);
  const [capsulePhotos, setCapsulePhotos] = useState([]);
  const [spotifySong, setSpotifySong] = useState();
  const [loading, setLoading] = useState(true); // State variable to track loading
  const [capsuleId, setCapsuleId] = useState("")
  const viewShotRef = useRef(null); // Reference for ViewShot
  const [isContentReady, setIsContentReady] = useState(false);

  //let capsule
  //let photos

  useEffect(() => {
    const fetchCapsuleData = async () => {
      try {
        const localCapsuleId = curUser.capsules[curUser.capsules.length - 1];
        setCapsuleId(localCapsuleId)
        const capsule = await getCapsule(localCapsuleId);
        const photos = capsule.usedPhotos.map(photo => photo.photoUrl);
        //let localpotifySong = capsule.spotifySongs[0]
        //if (spotifySong)
        setSpotifySong(capsule.spotifySongs[0])
        setCapsulePhotos(photos);

        //set curUser snapshot url and key
        /*const uri = await viewShotRef.current.capture();
        const imageKey = await postPhoto(uri)
        setSnapshotKey(capsuleId, imageKey)*/

        setIsContentReady(true);
        setLoading(false); // Data is loaded, set loading to false
      } catch (error) {
        console.error("Failed to fetch capsule data:", error);
        setLoading(false); // Ensure loading is set to false even if there's an error
      }
    };

    fetchCapsuleData();
  }, []);

  useLayoutEffect(() => {
    const saveSnapshot = async () => {
      if (viewShotRef.current && isContentReady) { // Check if content is ready
        setTimeout(async () => {
          const uri = await viewShotRef.current.capture();
          const imageKey = await postPhoto(uri);
          setSnapshotKey(capsuleId, imageKey);
        }, 5000);
      }
    };

    if (isContentReady) { // Execute only if content is ready
      saveSnapshot();
    }
  }, [isContentReady, capsuleId]);

  const combineImages = async () => {
    const uri = await viewShotRef.current.capture(); // Capture the layout as an image
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      const asset = await MediaLibrary.createAssetAsync(uri); // Save the captured image to the camera roll
      await MediaLibrary.createAlbumAsync('YourAlbumName', asset, false);
      Alert.alert("Image Saved", "Your combined image has been saved to the camera roll.");
    }
  };

  const getCurrentMonthName = () => {
    const date = new Date(); // Creates a new date object representing the current date and time
    const monthNames = [ // An array containing all the month names
      "January", "February", "March",
      "April", "May", "June",
      "July", "August", "September",
      "October", "November", "December"
    ];
    return monthNames[date.getMonth()]; // getMonth() returns the month in the range 0-11, which is used to get the month name from the array
  };
  
  const getCurrentYear = () => {
    const date = new Date();
    return date.getFullYear();
  }

  return (
    <>
      <BlackBackground>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Monthly Capsule</Text>
        
        <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }} style={styles.viewShotContainer}>
          <View style={styles.informationContainer}>
            <View style={styles.topbarContainer}>
              <View style={styles.yearTextContainer}>
                <Text style={styles.yearText}>{getCurrentYear()}</Text>
              </View>
              <View style={styles.monthTextContainer}>
                <Text style={styles.monthText}>{getCurrentMonthName()}</Text>
              </View>
              <Image source={require('../icons/capsuleWhite-.png')} style={styles.appIcon} />
            </View>
            <View style={styles.spotifySection}>
              <Image source={require('../icons/spotify-.png')} style={styles.spotifyIcon} />
              <Text style={styles.spotifyText}>Top Song: {spotifySong}</Text>
            </View>
          </View>
          <View style={styles.photosContainer}>
            {capsulePhotos.slice(0, 6).map((photoUrl, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri: photoUrl }} style={styles.photo} />
              </View>
            ))}
          </View>
        </ViewShot>
        <Button title="Save Combined Image" onPress={async () => {
          const combinedImageUri = await combineImages(capsulePhotos);
          //-await saveToCameraRoll(combinedImageUri);
        }} />
      </BlackBackground>
    </>
  );
}

const { width: screenWidth } = Dimensions.get('window');
const aspectRatio = 4284 / 5712;
const containerWidth = screenWidth - 40; // Subtracting some margin
const containerHeight = containerWidth / aspectRatio;

const photoWidth = containerWidth / 3 - 6;
const photoHeight = photoWidth * (4 / 3)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    // This view acts as a balance for the year text and ensures the month text is centered
    width: 75, // Match the width of the appIcon to balance the layout
    height: 50, // Match the height of the appIcon
    opacity: 0, // Make the spacer invisible
  },
  loadingContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  informationContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    //borderWidth: 3,
    //borderColor: 'red',
    height: '30%',
  },
  topbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures the logo is pushed to the far right
    width: '100%',
    position: 'relative',
    marginBottom: 10,

    //borderWidth: 2,
    //borderColor: 'red',
  },
  yearTextContainer: {
    //marginRight: 'auto',
    marginLeft: 20,
    //paddingTop: 15,
  },
  yearText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  monthTextContainer: {
    flex: 1, // Takes up all available space
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    justifyContent: 'center', // Center the month text vertically
    alignItems: 'center', // Center the month text horizontally
  },
  monthText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  appIcon: {
    width: 60,
    height: 40,
    right: 20,
    //backgroundColor: 'white',
  },
  spotifySection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    height: "50%",
    padding: 10,
    
    //borderWidth: 2,
    //borderColor: 'blue',
  },
  spotifyText: {
    fontSize: 18,
    color: '#fff',
  },
  spotifyIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 130,
    top: 80,
    color: "white"
  },
  viewShotContainer: {
    width: containerWidth,
    height: containerHeight,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#fff',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 3,
  },
  photoWrapper: {
    margin: 1, // Adjust spacing between photos
    borderWidth: 2,
    borderColor: '#fff',
    width: photoWidth,
    height: photoHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
});

export default Photos;
