import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Alert, ActivityIndicator, Button } from 'react-native'; // Import ActivityIndicator
import BackButton from "../Components/lightBackButton";
import BlackBackground from "../Components/BlackBackground";
import * as MediaLibrary from 'expo-media-library';
import { useGlobalContext } from "../context/globalContext";
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const Photos = ({ navigation }) => {
  const { BASE_S3_URL, getSpotifyTopSong, createCapsule, curUser } = useGlobalContext();
  const [photos, setPhotos] = useState([]);
  const [capsulePhotos, setCapsulePhotos] = useState([]);
  const [loading, setLoading] = useState(true); // State variable to track loading

  //let capsulePhotosUri = []
  //const canvasRef = useRef(null);

  //function to combine all photos
  const combineImages = async (capsulePhotos) => {
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
  
    // Combine images horizontally
    const combinedImage = await ImageManipulator.manipulateAsync(
      processedImages,
      [{ concatenate: { axis: 'horizontal', spacing: 10 } }],
      { format: 'jpg' } // Output format
    );
    console.log("combine: ", combinedImage)
  
    // Save the combined image to the filesystem
    const combinedImageUri = `${FileSystem.documentDirectory}combinedImage.jpg`;
    await FileSystem.copyAsync({ from: combinedImage.uri, to: combinedImageUri });
  
    console.log("test: ", combinedImageUri)
    return combinedImageUri;
  };


  const saveToCameraRoll = async (combinedImageUri) => {

  };

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
        <ScrollView>
          {capsulePhotos.map((photo, index) => (
            <Image key={index} source={{ uri: photo.uri }} style={styles.photo} />
          ))}
        </ScrollView>
      </BlackBackground>
    </>
  );
}

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
  photo: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
});

export default Photos;
