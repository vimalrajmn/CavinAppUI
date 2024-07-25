import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ProductScreen = ({ route }) => {
    const defaultImageUrl = 'https://via.placeholder.com/350';
    const { imageUrl = defaultImageUrl } = route.params || {};

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.text}>Product Screen Display</Text>
            </View>
            <Image source={{ uri: imageUrl }} style={styles.image} testID="product-image" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '90%',
        height: 350,
        borderRadius: 15,
    },
    text: {
        width: '30%',
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
    }
});

export default ProductScreen;

