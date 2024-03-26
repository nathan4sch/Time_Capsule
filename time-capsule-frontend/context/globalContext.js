import React, { useContext, useState } from "react"
import axios from 'axios'

// Defines the base URL for API calls

//CHANGE TO YOUR OWN IP ADDRESS
const BASE_URL = "https://time-capsule-server.onrender.com/api/v1/";
//const BASE_URL = "http://100.67.14.25:3000/api/v1/"
//https://time-capsule-server.onrender.com/api/v1/
//10.186.124.112
//100.67.14.58

// Create a context to share state and functions with components
const GlobalContext = React.createContext()

export const GlobalProvider = ({ children }) => {
    const [curUser, setCurUser] = useState("")
    const [users, setUsers] = useState([])
    const [error, setError] = useState(null)
    const [userEmail, setUserEmail] = useState("")

    // User Functions
    //Function to add user data
    const addUser = async (username, email) => {
        const response = await axios.post(`${BASE_URL}add-user`, {
            username: username,
            email: email,
        })
            .catch((err) => {
                setError(err.response.data.message)
            })
        //set cur user here?
        //console.log(response)
    }

    //Retrieve all users and update users state
    const getAllUsers = async () => {
        const response = await axios.get(`${BASE_URL}get-all-users`)
        setUsers(response.data)
    }

    const getUser = async (username) => {
        try {
            const response = await axios.get(`${BASE_URL}get-user/${username}`);
            //const response = await axios.get(`http://localhost:5000/api/v1/get-user/evmanz`);
            return response.data;
        } catch (error) {
            //console.error('Axios Error:', error); // Overall error type

            // Log specific error properties conditionally
            // if (error.response) {
            //     console.error('Response Data:', error.response.data);
            //     //console.error('Response Status:', error.response.status);
            //     //console.error('Response Headers:', error.response.headers);
            // } else if (error.request) {
            //     console.error('Request:', error.request);
            // } else {
            //     console.error('Error:', error.message);
            // }
            setError(error);
            return null;
        }
    };

    const getUserbyID = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}get-user-byID/${id}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error('Response Data:', error.response.data);
                //console.error('Response Status:', error.response.status);
                //console.error('Response Headers:', error.response.headers);
            } else if (error.request) {
                console.error('Request:', error.request);
            } else {
                console.error('Error:', error.message);
            }
            setError(error);
            return null;
        }
    };

    const emailExist = async (email) => {
        try {
            const response = await axios.get(`${BASE_URL}email-exist/${email}`);
            return response.data;
        } catch (error) {
            console.error('Axios Error:', error); // Overall error type

            // Log specific error properties conditionally
            if (error.response) {
                console.error('Response Data:', error.response.data);
                console.error('Response Status:', error.response.status);
                console.error('Response Headers:', error.response.headers);
            } else if (error.request) {
                console.error('Request:', error.request);
            } else {
                console.error('Error:', error.message);
            }
            setError(error);
            return null;
        }
    };



    const setSpotify = async (spotify) => {
        const response = await axios.post(`${BASE_URL}set-spotify-account/${curUser._id}`, {
            spotify: spotify,
        })
            .catch((err) => {
                setError(err.response.data.message)
            })
    }

    const setInstragram = async (instagramKey) => {
        const response = await axios.post(`${BASE_URL}set-instagram-account/${curUser._id}`, {
            spotify: instagramKey
        })
            .catch((err) => {
                setError(err.response.data.message)
            })
    }

    const removeFriendRequest = async (requestUsername) => {
        const response = await axios.delete(`${BASE_URL}remove-friend-request/${curUser._id}`, {
            data: { requestUsername }
        })
            .catch((err) => {
                setError(err.response.data.message)
            })
    }

    const sendFriendRequest = async (friendUsername) => {
        try {
            const response = await axios.post(`${BASE_URL}send-friend-request/${curUser._id}`, {
                friendUsername
            });
    
            return "Success";
    
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return "Not Found";
            } else if (error.response && error.response.status === 400) {
                return "Already Sent";
            }
        }
    };

    //post request so don't need to specify data
    const addFriend = async (friendUsername) => {
        try {
            // First request to add friend to current user
            const response1 = await axios.post(`${BASE_URL}add-friend/${curUser._id}`, {
                friendUsername
            });
    
            const otherUser = await getUser(friendUsername)
            const otherUserID = otherUser._id
            friendUsername = curUser.username   
            // Second request to add current user as a friend to the other user
            const response2 = await axios.post(`${BASE_URL}add-friend/${otherUserID}`, {
                friendUsername
            });
    
            // Handle success if needed
        } catch (err) {
            // Handle errors for both requests
            setError(err.response.data.message);
        }
    };

    //delete request so specify data
    const removeFriend = async (friendId) => {
        try {
            const response = await axios.delete(`${BASE_URL}remove-friend/${curUser._id}`, {
                data: { friendId }  // Pass the data in the 'data' property
            });
            const response2 = await axios.delete(`${BASE_URL}remove-friend/${friendId}`, {
                data: { friendId: curUser._id }  // Pass the data in the 'data' property
            });
        } catch (error) {
            // Handle errors
            if (error.response) {
                setError(error.response.data.message);
            } else {
                console.error('Error:', error.message);
            }
        }
    }

    const setLDMode = async () => {
        try {
            const response = await axios.post(`${BASE_URL}set-LD-mode/${curUser._id}`);
        
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                console.error('Error:', error.message);
            }
        }
    };

    const setProfilePictureUrl = async (profilePictureUrl) => {
        try {
            console.log("setURL")

            //console.log("settingProfileURL")
            console.log(curUser._id)
            const response = await axios.post(`${BASE_URL}set-profile-picture-url/${curUser._id}`, {
                profilePictureUrl
            });
            console.log("good")        
        } catch (error) {
            console.log("bad")
            console.log(error)
            console.log(error.response.data.message)
            if (error.response) {
                setError(error.response.data.message);
            } else {
                console.error('Error:', error.message);
            }
        }
    }

    const setProfilePictureKey = async (profilePictureKey) => {
        try {
            const response = await axios.post(`${BASE_URL}set-profile-picture-key/${curUser._id}`, {
                profilePictureKey
            });
        
        } catch (error) {
            console.log(error)
            console.log(error.response.data.message)

            if (error.response) {
                setError(error.response.data.message);
            } else {
                console.error('Error:', error.message);
            }
        }
    }

    const getCapsule = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}get-capsule/${id}`);
            return response.data;
        
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                console.error('Error:', error.message);
            }
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const response = await axios.delete(`${BASE_URL}delete-notification/${notificationId}`);        
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                console.error('Error:', error.message);
            }
        }
    };

    const deleteMoment = async (momentId) => {
        try {
            const response = await axios.delete(`${BASE_URL}delete-moment/${momentId}`);        
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                console.error('Error:', error.message);
            }
        }
    };

    const deleteCapsule = async (capsuleId) => {
        try {
            const response = await axios.delete(`${BASE_URL}delete-capsule/${capsuleId}`);        
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                console.error('Error:', error.message);
            }
        }
    };

    const deleteAccount = async (id) => {
        try {
            for (const friendId of curUser.friends) {
                const response = await removeFriend(friendId)
            }
            for (const capsuleId of curUser.capsules) {
                const response = await deleteCapsule(capsuleId);
            }
            for (const momentId of curUser.moments) {
                const response = await deleteMoment(momentId);
            }
            for (const notificationId of curUser.notifications) {
                const response = await deleteNotification(notificationId);
            }
            const response = await axios.delete(`${BASE_URL}delete-user/${id}`);
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.message)
                setError(error.response.data.message);
            } else {
                console.error('Error:', error.message);
            }
        }
    };


    // Provide the context value to child components
    return (
        <GlobalContext.Provider value={{
            addUser,
            users,
            setUsers,
            error,
            setError,
            getAllUsers,
            getUser,
            curUser,
            setCurUser,
            emailExist,
            userEmail,
            setUserEmail,
            getUserbyID,
            setSpotify,
            setInstragram,
            removeFriendRequest,
            sendFriendRequest,
            addFriend,
            removeFriend,
            setLDMode,
            getCapsule,
            deleteAccount,
            deleteCapsule,
            deleteMoment,
            deleteNotification,
            setProfilePictureUrl,
            setProfilePictureKey
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

// Custom hook to access the GlobalContext
export const useGlobalContext = () => {
    return useContext(GlobalContext)
}
