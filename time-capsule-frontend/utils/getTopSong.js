import * as WebBrowser from 'expo-web-browser';
import { SPOTIFY_SECRET } from '../env.js';
import { useGlobalContext } from "../context/globalContext";
import axios from 'axios';

export const getTopSong = async (curUser) => {
    console.log(curUser.profileSettings.spotifyAccount);
    //const { getSpotifyAccess } = useGlobalContext();
    const response = await axios.post(`http://100.69.11.19:3000/api/v1/get-spotify-access-token/${curUser._id}`, {
        spotify: curUser.profileSettings.spotifyAccount
    })
    //console.log(response.data.access_token)
    const { access_token } = response.data.access_token;

    const spotifyAPIUrl = 'https://api.spotify.com/v1/me/top/artists';
    const options = {
        method: 'GET', // GET is the default method, but it's good to be explicit
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    fetch(spotifyAPIUrl, {
        method: options.method,
        headers: options.headers
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // If the response is successful, parse it as JSON
            }
            throw new Error('Request failed: ' + response.statusText); // If response is not successful, throw an error
        })
        .then(data => {
            console.log(data); // Here you can process the data received from the API
            // For example, you might want to send this data back in your server's response or process it further
        })
        .catch(error => {
            console.error('Error:', error); // Handle any errors that occurred during the fetch
        });
    //getSpotifyAccess();
    // GET NEW ACCESS TOKEN
    /*
    // refresh token that has been previously stored
    const refreshToken = curUser.profileSettings.spotifyAccount;
    const url = "https://accounts.spotify.com/api/token";
    //console.log((Buffer.from('5a58784e6d234424b485e4add1ea7166' + ':' + '230e160afc41447794cd5598c31c18b6')))
    
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from('5a58784e6d234424b485e4add1ea7166' + ':' + '230e160afc41447794cd5598c31c18b6').toString('base64'))
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
    */


    //localStorage.setItem('access_token', response.accessToken);
    //localStorage.setItem('refresh_token', response.refreshToken);

}
