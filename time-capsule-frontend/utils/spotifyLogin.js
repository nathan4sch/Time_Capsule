import base64 from 'react-native-base64';
import * as WebBrowser from 'expo-web-browser';
import { SPOTIFY_SECRET } from '../env.js';

export const spotifyLogin = async ({ navigation, page, setSpotify }) => {
    const base64encode = (input) => {
        return base64.encode(input)
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * possible.length);
            randomString += possible.charAt(randomIndex);
        }
        return randomString;
    };
    const client_id = '5a58784e6d234424b485e4add1ea7166';
    const client_secret = SPOTIFY_SECRET; //TODO: need to probably store in Mongo and the request?s
    const redirect_uri = 'exp://localhost:19000/--/oauth2callback';
    const scope = 'user-read-private user-read-email user-top-read';
    const state = generateRandomString(16);

    let authUrl =
        `https://accounts.spotify.com/authorize?` +
        `client_id=${client_id}` +
        `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent(scope)}` +
        `&state=${state}`;

    let result = await WebBrowser.openAuthSessionAsync(authUrl, redirect_uri);

    if (result.type === 'success' && result.url) {
        const responseUrl = decodeURIComponent(result.url);
        const urlParams = new URLSearchParams(responseUrl.split('?')[1]);
        const code = urlParams.get('code');
        const returnedState = urlParams.get('state');

        if (returnedState !== state) {
            console.error('State mismatch!');
            return;
        }

        const base64Credentials = base64encode(`${client_id}:${client_secret}`);

        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${base64Credentials}`
            },
            body: `code=${code}&redirect_uri=${encodeURIComponent(redirect_uri)}&grant_type=authorization_code`
        };

        fetch(authOptions.url, {
            method: authOptions.method,
            headers: authOptions.headers,
            body: authOptions.body
        })
            .then(response => response.json())
            .then(data => {
                //TODO: store the refresh token in MongoDB
                setSpotify(data.refresh_token)
                navigation.navigate(page);
            })
            .catch(error => {
                console.error(error);
            });
    };
}
