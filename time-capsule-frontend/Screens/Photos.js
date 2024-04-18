import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  StyleSheet, Text, View, Image, ScrollView, Alert, Linking,  TouchableOpacity, ActivityIndicator, Button, Dimensions
} from 'react-native'; // Import ActivityIndicator
import BackButton from "../Components/lightBackButton";
import { buttonStyle } from "../Components/Button";
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
      if (viewShotRef.current && isContentReady) {
        setTimeout(async () => {
          const uri = await viewShotRef.current.capture();
          const imageKey = await postPhoto(uri);
          setSnapshotKey(capsuleId, imageKey);
        }, 5000);
      }
    };

    if (isContentReady) {
      saveSnapshot();
    }
  }, [isContentReady, capsuleId]);

  const openSpotifySong = async () => {
    let spotifyUrl;
    if (curUser.profileSettings.spotifyAccount !== "") {
      const spotifySongs = await getSpotifyTopSong();
      spotifyUrl = `https://open.spotify.com/track/${spotifySongs[1].id}`;
    }
    else {
      // Hey Jude by The Beatles
      spotifyUrl = `https://open.spotify.com/track/1eT2CjXwFXNx6oY5ydvzKU`;
    }

    try {                
      const supported = await Linking.canOpenURL(spotifyUrl);
      if (supported) {
        Linking.openURL(spotifyUrl);
      } else {
        console.log("Don't know how to open URI: " + spotifyUrl);
      }
    } catch (error) {
      console.error('Failed to open link:', error);
    }
  }

  const combineImages = async () => {
    const uri = await viewShotRef.current.capture();
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const albumName = 'Monthly Capsules';
      const albums = await MediaLibrary.getAlbumsAsync();

      const existingAlbum = albums.find(album => album.title === albumName);

      if (existingAlbum) {
        // Album already exists, add the photo to it
        await MediaLibrary.addAssetsToAlbumAsync([asset], existingAlbum, false);
        Alert.alert("Image Saved", "Your combined image has been saved to the album 'Monthly Capsules'.");
      } else {
        // Album doesn't exist, create a new album and add the photo to it
        const createdAlbum = await MediaLibrary.createAlbumAsync(albumName, asset, false);
        Alert.alert("Image Saved", `Your combined image has been saved to the new album '${albumName}'.`);
      }
    }
  };

  const getCurrentMonthName = () => {
    const date = new Date();
    const monthNames = [
      "January", "February", "March",
      "April", "May", "June",
      "July", "August", "September",
      "October", "November", "December"
    ];
    return monthNames[date.getMonth()];
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
              <TouchableOpacity
                //style={styles.spotifyButton}  // Apply your custom styles
                onPress={openSpotifySong}
              >
                <Text style={styles.spotifyText}>{`Top Song: ${spotifySong}`}</Text>
              </TouchableOpacity>
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

        <TouchableOpacity style={styles.buttonContainer} onPress={async () => {
            const combinedImageUri = await combineImages(capsulePhotos);
            //-await saveToCameraRoll(combinedImageUri);
            }}>
            <View style={buttonStyle.button}>
                <Image style={styles.icon} source={require('../icons/downloadIcon.png')} />
                <Text style={styles.buttonText}>Save Capsule</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={openSpotifySong}>
            <View style={buttonStyle.button}>
                <Image style={styles.icon} source={require('../icons/spotify-.png')} />
                <Text style={styles.buttonText}>Play Song</Text>
            </View>
        </TouchableOpacity>
      </BlackBackground>
    </>
  );
}

const { width: screenWidth } = Dimensions.get('window');
const aspectRatio = 4284 / 5712;
const containerWidth = screenWidth - 40; // Subtracting some margin
const containerHeight = containerWidth / aspectRatio;

const photoWidth = containerWidth / 3 - 1.4;
const photoHeight = photoWidth * (4 / 3)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    width: 75,
    height: 50,
    opacity: 0,
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
    justifyContent: 'space-between',
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
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
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
    zIndex: 100,

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
    top: 10,
    marginHorizontal: 0,
    //margin: 3,
  },
  photoWrapper: {
    //margin: 1, // Adjust spacing between photos
    borderWidth: 2,
    borderTopWidth: 3,
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

  buttonContainer: {
    top: 25,
    position: 'relative',
    width: '80%',
    height: '6.5%',
    marginBottom: '4%',
  },
  buttonText: {
    top: '23%',
    fontSize: 21,
    color: 'black',
  },
  icon: {
    position: 'absolute',
    left: '4%',
    top: '20%',
    width: 30,
    height: 30,
  }
});

export default Photos;
