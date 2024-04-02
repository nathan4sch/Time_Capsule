import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const ImageGrid = ({ images }) => {
    // Function to render each image or an empty view if the image is not available
    const renderImageItem = (image, index) => (
        <View key={index} style={styles.imageWrapper}>
            {image ? <Image source={{ uri: image }} style={styles.image} /> : <View style={styles.emptyImage} />}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {images.slice(0, 3).map((image, index) => renderImageItem(image, index))}
            </View>
            <View style={styles.row}>
                {images.slice(3, 6).map((image, index) => renderImageItem(image, index + 3))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '88%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        //borderWidth: 2,
        //borderColor: 'green',
        zIndex: 0,
    },
    row: {
        flexDirection: 'row',
    },
    imageWrapper: {
        flex: 1, // Equal width for all cells
        height: 152,
        width: 80,
        //aspectRatio: 3 / 4,
        padding: 2,
        //borderWidth: 2,
        //borderColor: 'white',
        top: '23%',
        //borderWidth: 2,
        //borderTopWidth: 3,
        //borderColor: '#fff',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    emptyImage: {
        backgroundColor: 'transparent', // Transparent background for empty cells
        flex: 1,
    },
});

export default ImageGrid;
