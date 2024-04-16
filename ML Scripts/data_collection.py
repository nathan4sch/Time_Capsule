import os
from google.cloud import vision_v1
import pandas as pd
import numpy as np
import pickle
from tqdm.auto import tqdm

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "timecapsule-414205-9d5c6c694c6d.json"

X_pickle_path = 'C:\\Users\\Kevin\\Documents\\CS 307\\Data Collection\\X_train.pkl'
y_pickle_path = 'C:\\Users\\Kevin\\Documents\\CS 307\\Data Collection\\y_train.pkl'
class_filepath = 'C:\\Users\\Kevin\\Documents\\CS 307\\Data Collection\\filenames-labels.txt'
photo_dir = 'C:\\Users\\Kevin\\Documents\\CS 307\\Data Collection\\Training Data\\'

def read_labels():
    df = pd.read_csv("./class-descriptions.csv", header=None)
    values = df.iloc[:, 1].tolist()
    return values

def create_feature_vector(labels):
    x_features = np.zeros(len(values), dtype=bool)
    indices = [i for i in range(len(values)) if values[i] in labels]
    x_features[indices] = 1
    return x_features


def analyze_image(image_path):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\\Users\\Kevin\\Documents\\CS 307\\Data Collection\\timecapsule-414205-9d5c6c694c6d.json"
    client = vision_v1.ImageAnnotatorClient()
    
    with open(image_path, 'rb') as image_file:
        image_content = image_file.read()

    image = vision_v1.types.Image(content=image_content)
    
    features = [
        vision_v1.types.Feature(type=vision_v1.types.Feature.Type.LABEL_DETECTION, max_results=100),
    ]
    
    response = client.annotate_image({
        'image': image,
        'features': features
    })
    
    labels = response.label_annotations
    descriptions = [label.description for label in labels]

    x = create_feature_vector(descriptions)
    return x

values = read_labels()

try:
    with open(X_pickle_path, 'rb') as file:
        X = pickle.load(file)
except FileNotFoundError:
    X = []

try:
    with open(y_pickle_path, 'rb') as file:
        y = pickle.load(file)
except FileNotFoundError:
    y = []

file_class = []
with open(class_filepath, 'r') as file:
    for line in file:
        filename, number = line.strip().split(',')
        filename = "" + filename
        number = int(number)
        if not os.path.exists(filename):
            newname = filename.split('.')
            filename = newname[0] + '.jpeg'
            if not os.path.exists(filename):
                newname = filename.split('.')
                filename = newname[0] + '.png'
                if not os.path.exists(filename):
                    newname = filename.split('.')
                    filename = newname[0] + '.jpg'
        file_class.append((filename, number))

for fc in tqdm(file_class):
    try:
        x_feature = analyze_image(fc[0])
        X.append(x_feature)
        y.append(fc[1])
    except Exception as e:
        print(e)

with open(X_pickle_path, 'wb') as file:
    pickle.dump(X, file)

with open(y_pickle_path, 'wb') as file:
    pickle.dump(y, file)