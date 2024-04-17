import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, FlatList, ActivityIndicator, Keyboard, Alert } from "react-native";
import PageNavBar from "../Components/PageNavBar";
import BlackBackground from "../Components/BlackBackground";
import { useGlobalContext } from "../context/globalContext";
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios'
import Loading from "../Components/Loading";
import { useIsFocused } from '@react-navigation/native';
import BottomTab from "../Components/BottomTab";
import { PanGestureHandler, State } from 'react-native-gesture-handler';


const Main = ({ navigation }) => {
    const { curUser, getMomentCount, addMoment, getCapsule, selectPhotos, capsuleKeys, BASE_S3_URL, createCapsule, getSpotifyTopSong, setCurUser, getUserbyID, getCapsuleUrl, setPublish } = useGlobalContext();
    const [timer, setTimer] = useState(calculateTimeUntilNextMonth());
    const [shownCapsule, setShownCapsule] = useState("");
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const [publishState, setPublishState] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [moment, setMoment] = useState('');
    const [margin, setMargin] = useState(0);
    const [momentCount, setMomentCount] = useState(0);

    let count = 0;

    const capsuleKeyChange = useRef(false);

    const isFocused = useIsFocused();


    const onSwipeLeft = () => {
        navigation.navigate('StoryBoard');
    };

    const onSwipeRight = () => {
        navigation.navigate('History');
    };    

    async function getPhotosFromMonth() {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
            setLoading(true);
            const month = new Date();
            month.setDate(1);

            month.setHours(0, 0, 0, 0);

            const media = await MediaLibrary.getAssetsAsync({ first: 7, createdAfter: month, mediaType: 'photo', sortBy: MediaLibrary.SortBy.creationTime });
            const assetInfoArray = [];
            for (const asset of media.assets) {
                try {
                    const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
                    assetInfoArray.push(assetInfo);
                } catch (error) {
                    console.error('Error:', error);
                    assetInfoArray.push(null); // Push null if an error occurs
                }
            }
            const uris = assetInfoArray.map(item => item.localUri);
            capsuleKeyChange.current = true;
            await selectPhotos(curUser._id, uris); 
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
                locCurUser = await getUserbyID(curUser._id)
                await setCurUser(locCurUser)
                //capsule = await getCapsule(curUser.capsules[0]);
                //get url from key
                //console.log("shown Capsule: ", capsule.snapshotUrl)
                const url = await getCapsuleUrl(locCurUser.capsules[locCurUser.capsules.length - 1])
                setShownCapsule(url);
                capsule = await getCapsule(locCurUser.capsules[locCurUser.capsules.length - 1])
                setPublishState(capsule.published)
            }
        };
        const getUserMomentCount = async () => {
            setMomentCount(await getMomentCount(curUser._id))
        }
        getCapsuleFunc();
        getUserMomentCount();
    }, [reload]);

    useEffect(() => {
        if (isFocused) {
            // Reset the shown capsule and any other relevant state
            setReload(!reload)
        }
    }, [isFocused]);


    //Countdown till end of month
    useEffect(() => {
        clearInterval(intervalId)
        const id = setInterval(() => {
            setTimer(calculateTimeUntilNextMonth());
        }, 1000);
        setIntervalId(id)
        return () => clearInterval(id);
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

    function calculateFiveSeconds(c) {
        const padWithZero = (value) => (value < 10 ? `0${value}` : value);
        return `${padWithZero(0)}:${padWithZero(0)}:${padWithZero(0)}:${padWithZero(c)}`;
    }

    function changeToTempTimer() {
        let count = 5;
        clearInterval(intervalId); // Clear the previous interval if it exists
        const id = setInterval(() => {
            if (count < 0) {
                clearInterval(id); // Clear the current interval
                getPhotosFromMonth();
                const newId = setInterval(() => {
                    setTimer(calculateTimeUntilNextMonth());
                }, 1000);
                setIntervalId(newId); // Update the intervalId state with the new interval ID
            } else {
                setTimer(calculateFiveSeconds(count));
                count -= 1;
            }
        }, 1000);
        setIntervalId(id); // Update the intervalId state with the current interval ID
    }

    const handleOverlayButtonPress = () => {
        navigation.navigate('StoryBoard');
    };

    const handlePublish = async () => {
        Alert.alert("Success", "Capsule Published", [{ text: "OK" }]);
        setPublish(curUser.capsules[curUser.capsules.length - 1])
        capsule = await getCapsule(curUser.capsules[curUser.capsules.length - 1])
        setPublishState(true)
    };

    const submitMoment = () => {
        addMoment(curUser._id, moment)
        setMomentCount(momentCount + 1)
        setMoment('')
    }

    const handleTextChange = (text) => {
        setMoment(text);
    };

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <PanGestureHandler
            onGestureEvent={({ nativeEvent }) => {
                //console.log(nativeEvent)
                if (nativeEvent.translationX < -50) {
                    onSwipeLeft();
                } else if (nativeEvent.translationX > 50) {
                    onSwipeRight();
                }
            }}
            onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.END) {
                    // Reset any animation or state changes related to the gesture
                }
            }}>
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={() => Keyboard.dismiss()}
                >
                    <BlackBackground>
                        <View style={styles.topButtonsContainer}>
                            <TouchableOpacity style={[styles.button, styles.timerButton]} onPress={() => changeToTempTimer()}>
                                <Text style={styles.buttonText}>Set Timer</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.button, styles.generateCapsuleButton]} onPress={() => getPhotosFromMonth()}>
                                <Text style={styles.buttonText}>Capsule</Text>
                            </TouchableOpacity>

                        </View>
                        <TouchableOpacity style={styles.profileContainer} onPress={() => navigation.navigate('Profile')}>
                            <Image style={styles.profileIcon}
                                source={{
                                    uri: curUser.profileSettings.profilePictureUrl,
                                }}
                                cachePolicy='memory-disk'
                            />
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.timerbutton} onPress={() => changeToTempTimer()}>
                    <Text style={styles.timerbuttonText}>SetTimer</Text>
                </TouchableOpacity> */}

                        <View style={styles.tempTimeContainer}>
                            <Text style={styles.timerText}>{timer}</Text>
                            <Text style={styles.unitText}>day       hour       min       sec</Text>
                        </View>
                        <View style={styles.buttonsContainer}>
                            {!publishState && shownCapsule && (
                                <TouchableOpacity
                                    style={styles.publishButton}
                                    onPress={handlePublish}
                                >
                                    <Text style={styles.publishButtonText}>Publish</Text>
                                </TouchableOpacity>
                            )}

                            {/* <TouchableOpacity style={styles.tempImageSelect} onPress={() => getPhotosFromMonth()}>
                        <Text style={styles.overlayText}>Test: Generate Capsule</Text>
                    </TouchableOpacity> */}

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[styles.momentEnter, { marginTop: margin }]}
                                    placeholder="Enter Moment"
                                    returnKeyType="done"
                                    onSubmitEditing={submitMoment}
                                    onChangeText={handleTextChange}
                                    onFocus={() => setMargin((shownCapsule && !publishState ? -495 : -360))}
                                    onBlur={() => setMargin(0)}
                                    value={moment}
                                />
                                <View style={[styles.numberSquare, { marginTop: margin }]}>
                                    <Text style={styles.number}>{momentCount}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.imageContainer}>
                            <View style={styles.overlayButton}>
                                {shownCapsule ? (
                                    <Image
                                        style={styles.capsuleImage}
                                        source={{ uri: shownCapsule }}
                                    />
                                ) : (
                                    <Text style={styles.overlayText}>No Capsule Available</Text>
                                )}
                            </View>

                        </View>
                        <View style={styles.capsuleList} />
                        <BottomTab navigation={navigation} state={{ index: 1 }} />

                    </BlackBackground>
                </TouchableOpacity>
            </View>
        </PanGestureHandler>

    );
}

export default Main;

const styles = StyleSheet.create({
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

    capsuleList: {
        position: 'absolute',
        top: '27%',
        width: '100%',
        height: '50%',
        backgroundColor: 'transparent',
        borderRadius: 20,
    },
    imageContainer: {
        position: 'absolute',
        borderRadius: 10,
        top: '27%',
        width: '100%',
        height: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    capsuleImage: {
        width: 330,
        height: 430,

        // get rid of that red border and make it black
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
    },
    overlayButton: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        zIndex: 2,
    },
    overlayText: {
        color: 'white',
        //position: 'absolute',
        fontWeight: 'bold',
        alignSelf: 'center',
    },

    buttonsContainer: {
        position: 'absolute',
        left: '10%',
        top: '77%',
        height: '10%',
        width: '80%',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 3
    },

    publishButton: {
        marginTop: 20,
        marginBottom: 20,
        width: '80%',
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },

    publishButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    timerButton: {
        flex: 1,
        backgroundColor: 'rgba(0, 245, 186, 0.5)',
        marginRight: 5,
        borderRadius: 10,
    },
    timerbuttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    photoButton: {
        left: '83%',
        aspectRatio: 1,
        height: '6%',
        borderRadius: 10,
        backgroundColor: 'aquamarine',
        alignItems: 'center',
    },
    tempImageSelect: {
        marginTop: 15,
        justifyContent: 'center',
        textAlign: 'center',
        padding: 10,
        width: '80%',
        backgroundColor: 'rgba(255, 50, 90, 0.67)',
        borderRadius: 10,
    },
    generateCapsuleButton: {
        flex: 1,
        backgroundColor: 'rgba(0, 245, 186, 0.5)',
        marginRight: 5,
        borderRadius: 10,
    },
    topButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
        paddingHorizontal: 10,
    }, button: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    }, momentEnter: {
        width: '80%',
        height: 40,
        backgroundColor: 'rgb(200, 200, 200)',
        borderRadius: 10,
        textAlign: 'left',
        paddingLeft: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        zIndex: 3
    },
    numberSquare: {
        width: 40,
        height: 40,
        backgroundColor: 'rgb(200, 200, 200)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    number: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
    }

});
