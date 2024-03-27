import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import BackButton from "../Components/lightBackButton";
import BlackBackground from "../Components/BlackBackground";
import * as MediaLibrary from 'expo-media-library';

const Photos = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const media = await MediaLibrary.getAssetsAsync({ first: 20, mediaType: 'photo', sortBy: MediaLibrary.SortBy.creationTime });
        setPhotos(media.assets);
      } else {
        alert('Permission to access camera roll denied!');
      }
    })();
  }, []);

  return (
    <>
        <BlackBackground>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={styles.title}>Last 20 Photos</Text>
            <ScrollView>
                {photos.map((photo, index) => (
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
