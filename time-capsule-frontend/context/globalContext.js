import React, { useContext, useState } from "react"
import axios from 'axios'

// Defines the base URL for API calls

//CHANGE TO YOUR OWN IP ADDRESS
const BASE_URL = "http://100.70.0.251:3000/api/v1/";
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
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

// Custom hook to access the GlobalContext
export const useGlobalContext = () => {
    return useContext(GlobalContext)
}