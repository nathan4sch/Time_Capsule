import React, { useState, useEffect, useRef } from 'react';
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
  const { BASE_S3_URL, getSpotifyTopSong, createCapsule, curUser } = useGlobalContext();
  const [photos, setPhotos] = useState([]);
  const [capsulePhotos, setCapsulePhotos] = useState([]);
  const [loading, setLoading] = useState(true); // State variable to track loading
  const viewShotRef = useRef(null); // Reference for ViewShot

  //let capsulePhotosUri = []
  //const canvasRef = useRef(null);

  //function to combine all photos
  /*const combineImages = async (capsulePhotos) => {
    // Define dimensions for the combined image
    const width = 600; // You can adjust these dimensions as per your requirements
    const height = 600;
  
    // Create an array to hold processed images
    const processedImages = [];
  
    // Process each image
    for (const photo of capsulePhotos) {
      const processedImage = await ImageManipulator.manipulateAsync(photo.uri, [
        { resize: { width, height } }, // Resize each image to fit the desired dimensions
      ]);
      processedImages.push(processedImage.uri);
    }

  };*/

  const combineImages = async () => {
    const uri = await viewShotRef.current.capture(); // Capture the layout as an image
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      const asset = await MediaLibrary.createAssetAsync(uri); // Save the captured image to the camera roll
      await MediaLibrary.createAlbumAsync('YourAlbumName', asset, false);
      Alert.alert("Image Saved", "Your combined image has been saved to the camera roll.");
    }
  };


  //const saveToCameraRoll = async (combinedImageUri) => {
  //};

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const month = new Date();
        month.setDate(1);
        const media = await MediaLibrary.getAssetsAsync({ first: 200, createdAfter: month, mediaType: 'photo', sortBy: MediaLibrary.SortBy.creationTime });
        setPhotos(media.assets);

        const shuffledAssets = media.assets.sort(() => Math.random() - 0.5);
        const selectedAssets = shuffledAssets.slice(0, 6);
        //for (index in selectedAssets) {
        //  capsulePhotosUri.push(selectedAssets[index].uri)
        //}
        setCapsulePhotos(selectedAssets);
      } else {
        alert('Permission to access camera roll denied!');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (capsulePhotos.length !== 0) {
        let imageArray = [];
        let spotifySongsArray = [];

        for (let index in capsulePhotos) {
          const photo = capsulePhotos[index];
          try {
            const assetInfo = await MediaLibrary.getAssetInfoAsync(photo);
            const localUri = assetInfo.localUri;
            const formData = new FormData();
            formData.append("image", {
              uri: localUri,
              type: 'image/jpeg',
              name: 'photo.jpg',
            });
            const response = await axios.post(`${BASE_S3_URL}api/posts`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            const imageKey = response.data.imageName;
            const photoObject = { photoKey: imageKey, photoUrl: "" };
            imageArray.push(photoObject);
          } catch (error) {
            console.error("Error processing photo:", error);
          }
        }

        if (curUser.profileSettings.spotifyAccount !== "") {
          spotifySongs = await getSpotifyTopSong();
          spotifySongsArray.push(spotifySongs);
        } else {
          spotifySongsArray.push("test");
        }

        snapshotKey = "temp";
        quote = "temp";

        await createCapsule(snapshotKey, imageArray, quote, spotifySongsArray);
        setLoading(false); // Set loading to false when capsule creation is complete
        Alert.alert("Success", "Capsule Created");
      }
    })();
  }, [capsulePhotos]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <>
      <BlackBackground>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Last Months Photos</Text>
        <Button title="Save Combined Image" onPress={async () => {
          const combinedImageUri = await combineImages(capsulePhotos);
          //-await saveToCameraRoll(combinedImageUri);
        }} />
        <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }} style={styles.viewShotContainer}>
          <Text style={styles.monthText}>January</Text>
          <Text style={styles.spotifyText}>Spotify Song</Text>
          <View style={styles.photosContainer}>
            {photos.slice(0, 6).map((photo, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri: photo.uri }} style={styles.photo} />
              </View>
            ))}
          </View>
        </ViewShot>
      </BlackBackground>
    </>
  );
}

const { width: screenWidth } = Dimensions.get('window');
const aspectRatio = 4284 / 5712;
const containerWidth = screenWidth - 40; // Subtracting some margin
const containerHeight = containerWidth / aspectRatio;

const photoWidth = containerWidth / 3 - 6;
const photoHeight = photoWidth * (4/3)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  /*photo: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },*/
  viewShotContainer: {
    width: containerWidth,
    height: containerHeight,
    backgroundColor: 'black', // Added for visibility, adjust as needed
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Ensure content does not exceed container bounds
  },
  monthText: {
    fontSize: 20, // Adjust font size as needed
    color: '#fff',
    fontWeight: 'bold',
  },
  spotifyText: {
    fontSize: 20, // Adjust font size as needed
    color: '#fff',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 3,
  },
  photoWrapper: {
    margin: 2, // Adjust spacing between photos
    borderWidth: 2, // Block border around each photo
    borderColor: '#fff',
    //width: '30%', // Adjust as needed to fit within the container
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
