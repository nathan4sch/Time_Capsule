import React, { useContext, useState } from "react"
import axios from 'axios'

// Defines the base URL for API calls
const BASE_URL = "http://localhost:5000/api/v1/";

// Create a context to share state and functions with components
const GlobalContext = React.createContext()

export const GlobalProvider = ({ children }) => {
    const [users, setUsers] = useState([])
    const [error, setError] = useState(null)

        // User Functions
    //Function to add user data
    const addUser = async (user) => {
        const response = await axios.post(`${BASE_URL}add-user`, user)
            .catch((err) => {
                setError(err.response.data.message)
            })
        getAllUsers()
    }

    //Retrieve all users and update users state
    const getAllUsers = async () => {
        const response = await axios.get(`${BASE_URL}get-all-users`)
        setUsers(response.data)
    }


    // Provide the context value to child components
    return (
        <GlobalContext.Provider value={{
            addUser,
            users,
            setUsers,
            error,
            setError,
            getAllUsers
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

// Custom hook to access the GlobalContext
export const useGlobalContext = () => {
    return useContext(GlobalContext)
}