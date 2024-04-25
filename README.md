# Time_Capsule
## Overview
(What our app is and why its cool)

## Database Design
In our project, we used MongoDB. Here we will store user info such as capsules, capsule data friends, and, usernames. Using MongoDB’s flexible schema, we can have varied ways to store information making MongoDB a good choice for flexible development. MondoDB is also very scalable which allows us to have a high quantity of data stored in our Mongo database.

MongoDB has a maximum document size of 16MB which could be an issue if a single user has multiple pictures tied to their account. To get past this we used an Amazon S3 bucket. The S3 bucket is specially designed so that each image is created with a unique key that must be used to obtain a URL for the image. This ensures that other users are not able to access any other user photos. The MongoDB will simply hold all the image keys that are then used to access the image in the S3 bucket.

## Frontend
Our frontend is built with React Native, a popular mobile design framework. We opted to go with React Native because of it's flexibility with available libraries and varying phone software systems (iphone and android). During development we used Expo Go for testing. Expo allowed us to have an efficient production to testing pipeline because it only takes a few seconds to run our code on our phones.

## Backend
The backend is a Node.js server that receives client requests and queries the database when needed. When a Capsule is generated, the User's photos from the previous month are all sent to the server. The server then sends each photo through the Google Vision API and runs our machine learning model to find six good photos to recap the month. Once the pictures are retrieved we query the Spotify API to get the User's top song from the previous month, package it all together, and send it back to the client.

Beyond just the Capsule generation, any time a User needs to update their account state (such as adding a new friend, editing a capsule, deleting their account) they make a request to a unique endpoint and our server performs the action.

## Machine Learning
