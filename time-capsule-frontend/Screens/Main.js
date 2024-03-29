import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, FlatList, ActivityIndicator, Keyboard, Alert } from "react-native";
import PageNavBar from "../Components/PageNavBar";
import BlackBackground from "../Components/BlackBackground";
import { useGlobalContext } from "../context/globalContext";
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios'
import Loading from "../Components/Loading";
import { useIsFocused } from '@react-navigation/native';

const Main = ({ navigation }) => {
    const { curUser, getCapsule, selectPhotos, capsuleKeys, BASE_S3_URL, createCapsule, getSpotifyTopSong, setCurUser, getUserbyID, getCapsuleUrl } = useGlobalContext();
    const [timer, setTimer] = useState(calculateTimeUntilNextMonth());
    const [shownCapsule, setShownCapsule] = useState("");
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);

    const capsuleKeyChange = useRef(false);

    const isFocused = useIsFocused();

    async function getPhotosFromMonth() {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
            setLoading(true);
            const month = new Date();
            month.setDate(1);
            const media = await MediaLibrary.getAssetsAsync({ first: 8, createdAfter: month, mediaType: 'photo', sortBy: MediaLibrary.SortBy.creationTime });
            const assetInfoPromises = media.assets.map(asset => MediaLibrary.getAssetInfoAsync(asset));
            const assetInfoResults = await Promise.all(assetInfoPromises);
            const uris = assetInfoResults.map(item => item.localUri);
            capsuleKeyChange.current = true;
            await selectPhotos(curUser._id, uris); //calls function in global context
            //waits till change in capsuleKeys then creates capsule with those keys
        } else {
            alert('Permission to access camera roll denied!');
        }
    }

    useEffect(() => {
        (async () => {
            if (capsuleKeyChange.current) {
                console.log("capsuleKeys: ", capsuleKeys)
                //here create the capsule
                let imageArray = [];
                let spotifySongsArray = [];

                for (index in capsuleKeys) {
                    const key = capsuleKeys[index]
                    //get photoUrl from key
                    const urlRes = await axios.get(`${BASE_S3_URL}api/get/${key}`);
                    const photoObject = { photoKey: key, photoUrl: urlRes.data.url };
                    imageArray.push(photoObject);
                }

                if (curUser.profileSettings.spotifyAccount !== "") {
                    spotifySongs = await getSpotifyTopSong();
                    spotifySongsArray.push(spotifySongs);
                } else {
                    spotifySongsArray.push("Hey Jude by The Beatles");
                }

                snapshotKey = "temp";
                quote = "temp";

                await createCapsule(snapshotKey, imageArray, quote, spotifySongsArray);
                locCurUser = await getUserbyID(curUser._id)
                await setCurUser(locCurUser)
                //setLoading(false); // Set loading to false when capsule creation is complete
                Alert.alert("Success", "Capsule Created");
                capsuleKeyChange.current = false;

                setLoading(false)
                navigation.navigate("Photos")
            }
        })();
    }, [capsuleKeys]);

    //render basic capsule on main page
    useEffect(() => {
        const getCapsuleFunc = async () => {
            if (curUser.capsules.length !== 0) {
                console.log("first")
                locCurUser = await getUserbyID(curUser._id)
                await setCurUser(locCurUser)
                //capsule = await getCapsule(curUser.capsules[0]);
                //get url from key
                //console.log("shown Capsule: ", capsule.snapshotUrl)
                const url = await getCapsuleUrl(locCurUser.capsules[locCurUser.capsules.length - 1])
                setShownCapsule(url);
            }
        };
        getCapsuleFunc();
    }, [reload]);

    useEffect(() => {
        if (isFocused) {
          // Reset the shown capsule and any other relevant state
          setReload(!reload)
        }
      }, [isFocused]);


    //Countdown till end of month
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimer(calculateTimeUntilNextMonth());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    function calculateTimeUntilNextMonth() {
        const now = new Date();
        const nextMonth = new Date(now);
        nextMonth.setMonth(now.getMonth() + 1);
        nextMonth.setDate(1);
        nextMonth.setHours(0, 0, 0, 0);

        const timeDifference = nextMonth - now;
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        const padWithZero = (value) => (value < 10 ? `0${value}` : value);

        return `${padWithZero(days)}:${padWithZero(hours)}:${padWithZero(minutes)}:${padWithZero(seconds)}`;
    }

    const handleOverlayButtonPress = () => {
        navigation.navigate('StoryBoard');
    };

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => Keyboard.dismiss()}
        >
            <BlackBackground>
                <TouchableOpacity style={styles.profileContainer} onPress={() => navigation.navigate('Profile')}>
                    <Image style={styles.profileIcon}
                        source={{
                            uri: curUser.profileSettings.profilePictureUrl,
                        }}
                        cachePolicy='memory-disk'
                    />
                </TouchableOpacity>
                <View style={styles.tempTimeContainer}>
                    <Text style={styles.timerText}>{timer}</Text>
                    <Text style={styles.unitText}>day       hour       min       sec</Text>
                </View>
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.overlayButton} onPress={handleOverlayButtonPress}>
                        {shownCapsule ? (
                            <Image
                                style={styles.capsuleImage}
                                source={{ uri: shownCapsule }}
                            />
                        ) : (
                            <Text style={styles.overlayText}>No Capsule Available</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.tempImageSelect} onPress={() => getPhotosFromMonth()}>
                    <Text style={styles.overlayText}>Test: Get Capsule</Text>
                </TouchableOpacity>
                <TextInput style={styles.momentButton}
                    placeholder="Enter Moment"
                    returnKeyType="done" />
                <View style={styles.capsuleList} />
            </BlackBackground>
        </TouchableOpacity>
    );
}

export default Main;

const styles = StyleSheet.create({
    tempImageSelect: {
        position: 'absolute',
        left: '10%',
        top: '81%',
        width: '80%',
        height: 45,
        backgroundColor: 'rgba(255, 50, 90, 0.67)',
        borderRadius: 10,
    },
    profileContainer: {
        position: 'absolute',
        top: 85,
        left: 25,
        height: '13%',
        aspectRatio: 1,
        borderRadius: 80,
    },
    profileIcon: {
        position: 'absolute',
        left: '-5%',
        height: '100%',
        aspectRatio: 1,
        borderRadius: 100,
    },
    tempTimeContainer: {
        position: 'absolute',
        flexDirection: 'column',
        width: 230,
        height: 70,
        left: 150,
        top: 100,
    },
    timerText: {
        fontFamily: 'Arial',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 40,
        lineHeight: 45,
        textAlign: 'center',
        color: 'white',
    },
    unitText: {
        fontFamily: 'Arial',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 15,
        lineHeight: 18,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    momentButton: {
        position: 'absolute',
        paddingLeft: 20,
        left: '10%',
        top: '87%',
        width: '80%',
        height: 31,
        backgroundColor: 'rgba(255, 255, 255, 0.67)',
        borderRadius: 10,
    },
    capsuleList: {
        position: 'absolute',
        top: '30%',
        width: '100%',
        height: '50%',
        backgroundColor: '#8E8E8E',
        borderRadius: 20,
    },
    imageContainer: {
        position: 'absolute',
        top: '30%',
        left: 0,
        width: '100%',
        height: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    capsuleImage: {
        height: '90%',
        width: '75%'
    },
    overlayButton: {
        backgroundColor: 'transparent',
        padding: 10,
        width: '100%',
        height: '100%',
        zIndex: 2,
    },
    overlayText: {
        color: 'black',
        fontWeight: 'bold',
        alignSelf: 'center',
        top: '50%'
    },
    photoButton: {
        position: 'absolute',
        top: '5%',
        left: '83%',
        aspectRatio: 1,
        height: '6%',
        borderRadius: 10,
        backgroundColor: 'aquamarine',
        alignItems: 'center',
    },
    overlayText: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
      },
});