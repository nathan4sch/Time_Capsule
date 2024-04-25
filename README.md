<p align="center">
  <img src="https://github.com/nathan4sch/Time_Capsule/assets/47926489/0f020972-6b11-4300-963d-de44a2a72ad5" />
</p>

# Time_Capsule
## Overview
Our project is a time capsule mobile application. An app that users can download and then receive monthly snapshots (called capsules) of their recent memories; from pictures to music, this immersive experience allows users to reminisce on the positive aspects of their month. The magic of our application is its automation: unlike other apps where the user is forced to spend the time creating their own monthly snapshot, our app gets downloaded and forgotten about… until the end of the month, when the user is surprised with a captivating, personalized visual and acoustic masterpiece!

As the world around us continues to move at an increasingly fast pace, time seems to fly by and good memories fall to the backs of our minds. This is the problem we hope to solve. People don’t have enough time to scroll through all their history of the past month and organize it to find their favorite moments. Capsule automates this process so that users can focus on their other day to day tasks and still enjoy a recap of their best memories.

We also seek to create a platform where users are able to share their Capsules with their friends and reminisce on good memories together. By allowing users to comment and react to their friend’s Capsules, we provide a platform in which a community wishing to be reminded of their best moments from the month can come together and positively impact one another. Our app combines automation and ease with an uplifting social platform, revolutionizing how people share past experiences together. 


## Database Design
In our project, we used MongoDB. Here we will store user info such as capsules, capsule data friends, and, usernames. Using MongoDB’s flexible schema, we can have varied ways to store information making MongoDB a good choice for flexible development. MondoDB is also very scalable which allows us to have a high quantity of data stored in our Mongo database.

MongoDB has a maximum document size of 16MB which could be an issue if a single user has multiple pictures tied to their account. To get past this we used an Amazon S3 bucket. The S3 bucket is specially designed so that each image is created with a unique key that must be used to obtain a URL for the image. This ensures that other users are not able to access any other user photos. The MongoDB will simply hold all the image keys that are then used to access the image in the S3 bucket.

## Frontend
Our frontend is built with React Native, a popular mobile design framework. We opted to go with React Native because of it's flexibility with available libraries and varying phone software systems (iphone and android). During development we used Expo Go for testing. Expo allowed us to have an efficient production to testing pipeline because it only takes a few seconds to run our code on our phones.

## Backend
The backend is a Node.js server that receives client requests and queries the database when needed. When a Capsule is generated, the User's photos from the previous month are all sent to the server. The server then sends each photo through the Google Vision API and runs our machine learning model to find six good photos to recap the month. Once the pictures are retrieved we query the Spotify API to get the User's top song from the previous month, package it all together, and send it back to the client.

Beyond just the Capsule generation, any time a User needs to update their account state (such as adding a new friend, editing a capsule, deleting their account) they make a request to a unique endpoint and our server performs the action.

## Machine Learning
Our app gathers the last month's photos from the user's camera roll and then intelligently analyzes those photos to find subjectively "good" photos to display in the capsule. We take a two step approach to this process. We first use Google Vision's API to get a series of labels. We then create a feature vector from these labels and run this through a custom machine learning model to predict if the picture is a good picture or not.
### Data Collection
In order to create our machine learning model, we first needed to collect training data. To do this, each member of the development team transfered all photos to their laptop and then went through each photo giving it a 0 if it was a bad photo, and a 1 if it was a good photo. We then ran each training photo through Google Vision to get labels for these images. From the labels we created feature vectors and stored their corresponding classification.
### Training the Model
After collecting data, we had approximately 4500 samples. We choose to train a neural network with one hidden layer consisting of 256 units. We selected a large number of units due to the large dimension of the input vector. When training the model, we split the samples into training data, validation data, and testing data. The validation data was used to tune hyper parameters. After training the model we achieved 91 % accuracy. After we finalized the model, we retrained it with all of the training data. Below is a graph displaying our training and validation accuracy and loss.
![pytorch_ann_train_val_metrics](https://github.com/nathan4sch/Time_Capsule/assets/44711717/2679a908-8994-47a0-8448-f60cdc6c3cf5)

### Using the Model
After we finished developing the model, we exported it according to the ONNX format. In our node JS backend, we load the model using the onnxruntime-node library. When processing a user’s images, we first upload it to Google Vision to create a feature vector from the labels. We then run the feature vector through our custom ONNX model and record the label. If the label returned indicates the photo is a good photo, it will be used to create the capsule.
