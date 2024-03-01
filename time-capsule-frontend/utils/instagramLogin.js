import * as WebBrowser from 'expo-web-browser';
import { INSTAGRAM_SECRET } from '../env.js';

export const instagramLogin = async ({navigation, page}) => {

    const handleTokenRequest = async (clientId, clientSecret, redirectUri, code) => {
        try {
            const response = await fetch('https://api.instagram.com/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: 'authorization_code',
                    redirect_uri: redirectUri,
                    code: code,
                }).toString(),
            });
    
            const responseData = await response.json();
            const access_token = responseData.access_token;
            // Handle the response data
            console.log(access_token);
            handleTokenExchange(INSTAGRAM_SECRET, access_token);
        } catch (error) {
            // Handle any errors
            console.error('Error:', error);
        }
    };


    const handleTokenExchange = async (appSecret, shortLivedAccessToken) => {
        try {
            const response = await fetch(
                `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortLivedAccessToken}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            const responseData = await response.json();
            const longLivedAccessToken = responseData.access_token;
            // Handle the response data
            console.log(longLivedAccessToken);
            navigation.navigate(page);
        } catch (error) {
            // Handle any errors
            console.error('Error:', error);
        }
    };

    console.log("here");
    let redirectUrl = 'exp://localhost:19000/--/oauth2callback'; // Get the redirect URL
    let authUrl =
        `https://api.instagram.com/oauth/authorize` +
        `?client_id=956916255292975` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
        `&scope=user_profile,user_media` +
        `&response_type=code`;

    let result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

    if (result.type === 'success') {
        // Handle the authentication response here
        if (result.params.error) {
            console.error('Authentication error:', result.params.error);
        } else {
            // Extract the access token from the result
            let { code } = result.params;
            console.log(code);
            handleTokenRequest('956916255292975', INSTAGRAM_SECRET, redirectUrl, code);
            // Use the code to make further API calls or perform other tasks
        }
    }
};