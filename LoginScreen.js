import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [designation, setDesignation] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedName = await AsyncStorage.getItem('name');
                const storedAge = await AsyncStorage.getItem('age');
                const storedDesignation = await AsyncStorage.getItem('designation');
                if (storedName && storedAge && storedDesignation) {
                    setName(storedName);
                    setAge(storedAge);
                    setDesignation(storedDesignation);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                Alert.alert('Error', 'Failed to fetch user data.');
            }
        };

        fetchUserData();
    }, []);

    const saveData = async () => {
        if (!name || !age || !designation) {
            if (!name) {
                Alert.alert('Please enter your name');
            } else if (!age) {
                Alert.alert('Please enter your age');
            } else if (!designation) {
                Alert.alert('Please enter your designation');
            }
            return;
        }
        try {
            await AsyncStorage.setItem('name', name);
            await AsyncStorage.setItem('age', age);
            await AsyncStorage.setItem('designation', designation);
            navigation.navigate('HomeScreen');
        } catch (e) {
            console.error('Error saving data', e);
            Alert.alert('Error', 'Failed to save user data.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Image source={require('./images/1690439950225.jpg')} style={styles.logo} />
                <Text style={styles.heading}>Login Form</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Name'
                    placeholderTextColor="#000000"
                    value={name}
                    onChangeText={text => setName(text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder='Age'
                    placeholderTextColor="#000000"
                    keyboardType='numeric'
                    value={age}
                    onChangeText={text => setAge(text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder='Designation'
                    placeholderTextColor="#000000"
                    value={designation}
                    onChangeText={text => setDesignation(text)}
                />

                <Button title="Submit" onPress={saveData} />
            </View> 
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        padding: 15,
        color: 'black'
    },
    input: {
        width: '60%',
        height: 40,
        borderWidth: 1,
        borderColor: 'grey',
        marginBottom: 30,
        padding: 10,
        fontSize: 20,
        color: 'black'
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
});

export default LoginScreen;
