# Time_Capsule
## Overview
(What our app is and why its cool)

## Database Design

## Frontend Development

## Backend Development

## Machine Learning
Our app gathers the last month's photos from the user's camera roll and then intelligently analyzes those photos to find subjectively "good" photos to display in the capsule. We take a two step approach to this process. We first use Google Vision's API to get a series of labels. We then create a feature vector from these labels and run this through a custom machine learning model to predict if the picture is a good picture or not.
### Data Collection
In order to create our machine learning model, we first needed to collect training data. To do this, each member of the development team transfered all photos to their laptop and then went through each photo giving it a 0 if it was a bad photo, and a 1 if it was a good photo. We then ran each training photo through Google Vision to get labels for these images. From the labels we created feature vectors and stored their corresponding classification.
### Training the Model
After collecting data, we had approximately 4500 samples. We choose to train a neural network with one hidden layer consisting of 256 units. We selected a large number of units due to the large dimension of the input vector. When training the model, we split the samples into training data, validation data, and testing data. The validation data was used to tune hyper parameters. After training the model we achieved 91 % accuracy. After we finalized the model, we retrained it with all of the training data. Below is a graph displaying our training and validation accuracy and loss.
![pytorch_ann_train_val_metrics](https://github.com/nathan4sch/Time_Capsule/assets/44711717/2679a908-8994-47a0-8448-f60cdc6c3cf5)

### Using the Model
After we finished developing the model, we exported it according to the ONNX format. In our node JS backend, we load the model using the onnxruntime-node library. When processing a user’s images, we first upload it to Google Vision to create a feature vector from the labels. We then run the feature vector through our custom ONNX model and record the label. If the label returned indicates the photo is a good photo, it will be used to create the capsule.
