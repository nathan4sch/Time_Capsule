import base64 from 'react-native-base64';
import * as WebBrowser from 'expo-web-browser';
import { SPOTIFY_SECRET } from '../env.js';
import { useGlobalContext } from "../context/globalContext";

export const getTopSong = async (curUser) => {
    console.log(curUser.profileSettings.spotifyAccount);

    // GET NEW ACCESS TOKEN
    // refresh token that has been previously stored
    const refreshToken = curUser.profileSettings.spotifyAccount;
    const url = "https://accounts.spotify.com/api/token";
    
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: '5a58784e6d234424b485e4add1ea7166'
        }),
    }
    const body = await fetch(url, payload);
    console.log(body);
    const response = await body.json();
    console.log("Access token: " + response.accessToken);
    const spotifyResponse = fetch("https://api.spotify.com/v1/me/top/tracks",{
        headers:{
            'Authorization': `Bearer ${body._bodyBlob._data.blobId}`
        }
    })
    console.log(spotifyResponse);

    //localStorage.setItem('access_token', response.accessToken);
    //localStorage.setItem('refresh_token', response.refreshToken);
    
}
