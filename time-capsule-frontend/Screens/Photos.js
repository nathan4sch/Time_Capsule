import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Alert } from 'react-native';
import BackButton from "../Components/lightBackButton";
import BlackBackground from "../Components/BlackBackground";
import * as MediaLibrary from 'expo-media-library';
import { useGlobalContext } from "../context/globalContext";
import axios from 'axios'

const Photos = ({ navigation }) => {
  const { BASE_S3_URL, getSpotifyTopSong, createCapsule, curUser } = useGlobalContext();
  const [photos, setPhotos] = useState([]);
  const [capsulePhotos, setCapsulePhotos] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const month = new Date();
        month.setDate(1);
        //EDIT HOW MANY PHOTOS HERE WITH FIRST
        const media = await MediaLibrary.getAssetsAsync({ first: 200, createdAfter: month, mediaType: 'photo', sortBy: MediaLibrary.SortBy.creationTime });
        setPhotos(media.assets);

        const shuffledAssets = media.assets.sort(() => Math.random() - 0.5);
        const selectedAssets = shuffledAssets.slice(0, 6);
        //console.log("selected Assets: ", selectedAssets)
        setCapsulePhotos(selectedAssets);
      } else {
        alert('Permission to access camera roll denied!');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (capsulePhotos.length != 0) {
        let imageArray = [];
        let spotifySongsArray = [];
        //need capsule photos, spotify, month (look at timestamp), quote?, moment?
        //get capsule photos, publish each, get the key
        for (let index in capsulePhotos) {
          //console.log("sending photo: ", index)
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
        //images in imageKeysArray
        //console.log(imageKeysArray)
        if (curUser.profileSettings.spotifyAccount != "") {
          spotifySongs = await getSpotifyTopSong()
          spotifySongsArray.push(spotifySongs)
        } else {
          spotifySongsArray.push("test")
        }
        

        snapshotKey = "temp"
        quote = "temp"

        await createCapsule(snapshotKey, imageArray, quote, spotifySongsArray);
        Alert.alert("Success", "Capsule Created");
        //console.log("capsule created")

      }
    })();
  }, [capsulePhotos]);

  /*
  return (
    <>
      <BlackBackground>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Last Months Photos</Text>
        <ScrollView>
          {photos.map((photo, index) => (
            <Image key={index} source={{ uri: photo.uri }} style={styles.photo} />
          ))}
        </ScrollView>
      </BlackBackground>
    </>
  );
  */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
