import React, { useEffect, useState } from "react";
import { View, Image, Text, TextInput, TouchableOpacity, FlatList, Keyboard, Alert } from "react-native";
import BlackBackground from "../Components/BlackBackground";
import { commonStyles } from "../Components/FriendsPageStylings";
import { useGlobalContext } from "../context/globalContext";

const Friends = ({ navigation }) => {
    const { setCurUser, curUser, getUserbyID, addFriend, removeFriendRequest, removeFriend, getUser, sendFriendRequest, error } = useGlobalContext();
    const [friendRequests, setFriendRequest] = useState(curUser.friendRequests)
    const [friendObj, setFriendObj] = useState([]);
    const [reloadApp, setReloadApp] = useState(false);

    const [searchInput, setSearchInput] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            // Retrieve current user
            const updatedUser = await getUserbyID(curUser._id);
            setCurUser(updatedUser);
            setFriendRequest(updatedUser.friendRequests);

            const promises = updatedUser.friends.map(async (id) => {
                return await getUserbyID(id);
            });

            const friendData = await Promise.all(promises);
            setFriendObj(friendData);
        };

        fetchData();
        console.log(friendObj.concat(friendRequests));
    }, [reloadApp]);

    const acceptFriendRequest = async (requestUsername) => {
        await addFriend(requestUsername)
        await removeFriendRequest(requestUsername)
        setReloadApp(!reloadApp);
    }

    const rejectFriendRequest = async (requestUsername) => {
        await removeFriendRequest(requestUsername)
        setReloadApp(!reloadApp);
    }

    const removeFriendObj = async (friendObj) => {
        await removeFriend(friendObj._id)
        setReloadApp(!reloadApp);
    }

    const handleSearchSubmit = async () => {
        //console.log(searchInput); // Print the input value to the console
        ret = await sendFriendRequest(searchInput)
        if (ret === "Success") {
            Alert.alert("Success", "Friend Request Sent");
        } else if (ret === "Not Found") {
            Alert.alert("Error", "Username Not Found");
        } else if (ret === "Already Sent") {
            Alert.alert("Error", "Request Already Sent");
        }
        setSearchInput(""); // Clear the TextInput
    };

    const renderFriendItems = ({ item }) => {    
        let content;
    
        if (typeof item === "string") {
            content = (
                <View style={commonStyles.listItemContainer}>
                    <Text style={commonStyles.usernameText}>{item}</Text>
                    <TouchableOpacity style={commonStyles.rejectButton} onPress={() => rejectFriendRequest(item)}>
                        <Text style={commonStyles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={commonStyles.acceptButton} onPress={() => acceptFriendRequest(item)}>
                        <Text style={commonStyles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                </View>
            );
        } else if (typeof item === "object") {
            content = (
                <View style={commonStyles.listItemContainer}>
                    <Image
                      style={commonStyles.friendIcon}
                      source={{
                      uri: item.profileSettings.profilePicture,
                      }}
                      onError={(error) => console.error("Image load error:", error)}
                    />
                    <Text style={commonStyles.usernameText}>{item.username}</Text>
                    <TouchableOpacity style={commonStyles.removeButton} onPress={() => removeFriendObj(item)}>
                        <Text style={commonStyles.buttonText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            if (item == 1) {
                content = (
                    <>
                        <Text style={commonStyles.title}>Friend Requests</Text>
                        <View style={commonStyles.line} />
                    </>
                )
            }
            else if (item == 2) {
                content = (
                    <>
                        <Text style={commonStyles.title}>Friends</Text>
                        <View style={commonStyles.line} />
                    </>
                )
            }
            else {
                content = (
                    <Text style={commonStyles.title1}>Friends will be displayed here</Text>
                )
            }
        }
    
        return content;
    };
    
    return (
        <TouchableOpacity
            style={{ flex: 1 }} // Ensure the TouchableOpacity takes up the entire screen
            activeOpacity={1} // Ensure the TouchableOpacity is touchable
            onPress={() => Keyboard.dismiss()} // Dismiss the keyboard on press
        >
            <BlackBackground>

                <TouchableOpacity style={commonStyles.backButtonTop} onPress={() => navigation.navigate('TempMain')}>
                    <View style={commonStyles.arrowContainer}>
                        <Image style={commonStyles.arrowIconContainer} source={require('../icons/tempbackarrow-.png')} />
                    </View>
                </TouchableOpacity>

                <View style={commonStyles.searchContainer}>
                    <View style={commonStyles.searchBar} />
                    <Image style={commonStyles.searchIconContainer} source={require('../icons/search-.png')} />
                    <TextInput
                        style={commonStyles.searchTextContainer}
                        placeholder="add friends..."
                        returnKeyType="done"
                        value={searchInput}
                        onChangeText={(text) => setSearchInput(text)}
                        onSubmitEditing={handleSearchSubmit}
                    />
                </View>


                <View style={commonStyles.listContainer}>

                    <FlatList
                        data={friendObj.length > 0 ? (friendRequests.length > 0 ? [1].concat(friendRequests.concat([2]).concat(friendObj)) : [2].concat(friendObj)) : (friendRequests.length > 0 ? [1].concat(friendRequests.concat([2,3])) : [2,3])}
                        keyExtractor={(item) => item.toString()}
                        renderItem={renderFriendItems}
                        ItemSeparatorComponent={() => <View style={commonStyles.separator} />}
                    />
                </View>
            </BlackBackground>
        </TouchableOpacity>
    );
};

export default Friends;