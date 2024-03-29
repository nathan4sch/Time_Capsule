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

  return (
    <>
      <BlackBackground>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Monthly Capsule</Text>
        
        <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }} style={styles.viewShotContainer}>
          <Text style={styles.monthText}>January</Text>
          <Image source={require('../icons/capsule-.png')} style={styles.appIcon} />
          <View style={styles.spotifySection}>
            <Image source={require('../icons/spotify-.png')} style={styles.spotifyIcon} />
            <Text style={styles.spotifyText}>Top Song: {spotifySong}</Text>
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
  loadingContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    borderColor: 'red',
  },
  monthText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    top: -50,
  },
  spotifyText: {
    fontSize: 18,
    color: '#fff',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 3,
    bottom: -50
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
  appIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 50,
    height: 50,
  },
  spotifySection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spotifyIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
});

export default Photos;
