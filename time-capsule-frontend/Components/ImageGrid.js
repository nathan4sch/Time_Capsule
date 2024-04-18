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
        left: "0%",
        width: '88%',
        height: '100%',
        justifyContent: 'space',
        alignItems: 'center',
        //borderWidth: 2,
        //borderColor: 'green',
        zIndex: 0,

    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    imageWrapper: {
        width: "32.2%",
        height: 147,
        //backgroundColor: "red",
        marginBottom: 3,
        top: "45.6%",
        margin: 1.4

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
