import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const ImageGrid = ({ images }) => {
  // Function to render each image or an empty view if the image is not available
  const renderImageItem = (image, index) => (
    <View key={index} style={styles.imageWrapper}>
      {image ? <Image source={{ uri: image }} style={styles.image} /> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      {images.map((image, index) => renderImageItem(image, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // Adjust padding, margin, etc. as needed
  },
  imageWrapper: {
    width: '33%', // For 3 columns layout
    aspectRatio: 1, // For square cells, adjust as needed
    padding: 4, // Adjust padding to control spacing
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default ImageGrid;
