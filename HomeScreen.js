import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator,Pressable, FlatList, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback, Keyboard, Alert, Modal, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedItems, setExpandedItems] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: '', age: '', designation: '' });

    const navigation=useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const name = await AsyncStorage.getItem('name');
                const age = await AsyncStorage.getItem('age');
                const designation = await AsyncStorage.getItem('designation');
                if (name && age && designation) {
                    setUserInfo({ name, age, designation });
                }
            } catch (e) {
                console.error('Error retrieving user data', e);
                Alert.alert('Error', 'Failed to retrieve user data.');
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = 'https://60cc791971b73400171f7d68.mockapi.io/api/v1/products';
                const response = await axios.get(url);
                const sortedData = response.data.sort((a, b) => b.num_of_purchases - a.num_of_purchases);
                setData(sortedData);
                setLoading(false);
                if (sortedData.length > 1) {
                    setExpandedItems(sortedData[1].id);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredData(data);
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = data.filter(item =>
                item.name.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredData(filtered);
        }
    }, [searchQuery, data]);

    const toggleExpand = (itemId) => {
        setExpandedItems(expandedItems === itemId ? null : itemId);
    };

    const renderItem = ({ item, index }) => (
        <Pressable
            onPress={() => toggleExpand(item.id)}
            style={styles.item}
        >
        <View style={[styles.titleContainer, {backgroundColor: expandedItems===item.id ? '#ddd' : 'white',borderBottomLeftRadius: expandedItems===item.id ? 0 : 10,borderBottomRightRadius: expandedItems===item.id ? 0 : 10,}]}>
            <Text style={[styles.indexText,{color:expandedItems===item.id?'black':'grey'}]}>{`#${index + 1}`} </Text>
            <Text style={styles.nameText}>{item.name}</Text>
        <Image 
        source={expandedItems===item.id 
            ? require('./images/up-arrow.png') 
            : require('./images/down-arrow.png')} 
            style={styles.dropdownIcon} 
            />
        </View>
                {expandedItems===item.id && (
                    <>
                    <View style={{flexDirection:'row',width:'100%',paddingHorizontal:20,paddingTop:15}}>
                        <View style={{width:'65%',flexDirection:'column',alignSelf:'flex-start'}}>
                        <Text style={styles.deshead}>Product id</Text>
                        <Text style={styles.heading}>{item.pid}</Text>
                        <View style={{width:'65%',flexDirection:'column'}}>  
                                <Text style={styles.deshead}>Product name</Text>
                                <Text style={styles.heading}>{item.name}</Text>
                        </View>
                        </View>
                        <View style={{width:'35%',}}>
                            <TouchableOpacity onPress={()=>navigation.navigate('ProductScreen',{imageUrl: item.image})}>
                            <Image source={{uri:item.image}} style={styles.images} />
                            </TouchableOpacity>
                        </View>
                       
                    </View>
                     <View style={{flexDirection:'row',width:'100%',paddingTop:10,paddingHorizontal:20}}>
                         <View >
                             <Text style={styles.deshead}>Product description</Text>
                             <Text style={styles.heading}>{item.description}</Text>
                         </View>
                 </View>
                 <View style={{flexDirection:'row',width:'100%',paddingHorizontal:20,paddingTop:5}}>
                    <View style={{flexDirection:'column',width:'70%'}}>
                        <Text style={styles.deshead}>Product price</Text>
                        <Text style={styles.heading}>${item.price}</Text>
                    
                    <View style={{flexDirection:'column',width:'70%'}}>
                        <Text style={styles.deshead}>Sale price</Text>
                        <Text style={styles.heading}>${item.sale_price}</Text>
                    </View>
                    </View>
                    <View style={styles.purchasecontainer}>
                        <Text style={styles.purchase}>Purchased</Text>
                        <Text style={styles.numpurchase}>{item.num_of_purchases}</Text>
                    </View>
                 </View>
                 <View style={{flexDirection:'row',paddingHorizontal:20,paddingTop:6,padding:30}}>
                    <View style={{flexDirection:'column',width:'90%'}}>
                    <Text style={styles.deshead}>Status</Text>
                    <Text style={[styles.status, { backgroundColor: item.status ? 'green' : 'red' }]}>{item.status ? 'Published':'Not Published'}</Text>
                    </View>
                    <View style={styles.registration}>
                        <View style={styles.registerimagecontainer}>
                        <Image source={require('./images/registration-form.png')} style={styles.registrationimage}/>
                        </View>
                    </View>
                 </View>
                    </>
                )}
            </Pressable>
    );

    const handleRightIconPress = async () => {
        try {
            const name = await AsyncStorage.getItem('name');
            const age = await AsyncStorage.getItem('age');
            const designation = await AsyncStorage.getItem('designation');
            if (name && age && designation) {
                setUserInfo({ name, age, designation });
                setIsModalVisible(true);
            } else {
                Alert.alert('No User Data', 'No user data found. Please log in first.');
            }
        } catch (e) {
            console.error('Error retrieving data', e);
            Alert.alert('Error', 'Failed to retrieve user data.');
        }
    };

    const storeUserData = async (name, age, designation) => {
        try {
            await AsyncStorage.setItem('name', name);
            await AsyncStorage.setItem('age', age);
            await AsyncStorage.setItem('designation', designation);
            setUserInfo({ name, age, designation }); // Update userInfo state after storing
        } catch (e) {
            console.error('Error storing user data:', e);
            Alert.alert('Error', 'Failed to store user data.');
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };
    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    if (error) {
        return (
            <View style={[styles.container, styles.errorContainer]}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={()=>navigation.dispatch(DrawerActions.toggleDrawer())}>
                    <Image source={require('./images/setting.png')} style={styles.settingsIconLeft} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.settingsIconRight} onPress={handleRightIconPress}>
                    <Image source={require('./images/avataricon.png')} style={styles.settingsIconRight} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.allProductsText}>All Products</Text>
                <Text style={styles.subtext}>Lorem ipsum dolor sit amet.</Text>

                <View style={styles.searchcontainer}> 
                    <Image source={require('./images/search.png')} style={styles.searchimage}/>
                    
                    
                    <TextInput
                    style={styles.searchInput}
                    placeholder="Search products"
                    placeholderTextColor='black'
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                />
              
                </View>
                
                {filteredData.length === 0 ? (
                    <View style={styles.noProductsContainer}>
                        <Text style={styles.noProductsText}>No products available</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                    />
                )}

                <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>User Info</Text>
                            <Text style={styles.modalText}>Name: {userInfo.name}</Text>
                            <Text style={styles.modalText}>Age: {userInfo.age}</Text>
                            <Text style={styles.modalText}>Designation: {userInfo.designation}</Text>
                            <Button title="Close" onPress={closeModal} />
                        </View>
                    </View>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'red',
    },
    registerimagecontainer:{
        height:35,
        width:32,
        borderWidth:0.5,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
    },
    searchcontainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'flex-end',
        borderColor: '#ddd',
        borderRadius: 10, 
        paddingHorizontal: 10,
        height: 50, 
        margin: 20,
        backgroundColor:'#EEEEEE'
    },
    searchimage:{
        width: 20, 
        height: 20,
        marginRight: 10,
    },
    registration:{
        width:"20%",
        alignSelf:'flex-end'
    },
    registrationimage:{
        height:25,
        width:25,
    },
    item: {  
        backgroundColor: 'white',
        marginVertical: 8,
        borderRadius: 12,
        elevation:10, 
    },
    images: {
        height: 130,
        width: '100%',
        resizeMode: 'cover',  
        borderRadius: 20,
        marginTop:15   
    },
    purchasecontainer:{
        flexDirection:'column',
        height:90,
        width:90,
        borderRadius:10,
        backgroundColor:'#EEC2C2',  
        alignItems:'center',
        marginTop:30
    },
    purchase:{
        fontSize:15,
        color:'grey',
        marginTop:15
    },
    numpurchase:{
        color:'red',
        fontSize:35,
        fontWeight:'bold',
        padding:2
    },
    searchInput: {
        width:'90%', 
        fontSize: 16,
        padding:10,
        color:'black', 
    },
    allProductsText: {
        fontSize: 28,
        fontWeight:'bold',
        marginBottom: 10,
        color: 'black',
        alignSelf:'flex-start',
        marginLeft:20,
    },
    subtext:{
        fontSize:15,
        color:'grey',
        marginLeft:20,
        marginBottom:8,
    },
    info: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'right',
    },
    infoT: {
        fontSize: 15,
        color: 'grey',
        textAlign: 'right',
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        paddingTop:5    
    },
    deshead: {
        fontSize: 15,
        color: 'grey',
        paddingTop:15
    },
    status: {
        fontSize: 15,
        fontWeight: 'bold',
        paddingVertical: 2.5,
        paddingHorizontal:10,
        marginTop:5,
        borderRadius: 20,
        textAlign: 'center',
        alignSelf:'flex-start',
        color:'white'
    },
    header: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 10,
        backgroundColor: '#fff',
    },
    settingsIconLeft: {
        height:30,
        width:30,
        marginBottom:20,
        //backgroundColor:'red',
        borderRadius:5,
        marginLeft:10
        
    },
    settingsIconRight: {
        height:35,
        width:38,
        marginBottom:16,
        marginRight:15,
        borderRadius:20
    },
    noProductsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noProductsText: {
        fontSize: 18,
        color: 'black',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: { 
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black'
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
        color: 'black'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor:'white',
        padding:20,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
    },
    dropdownIcon: {
        height: 30,
        width:10,
        marginLeft: 10,
    },
    indexText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },  
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        flex:1,
        paddingLeft:18
    },
    searchimage: {
        height: 25,
        width:25
    },   
});

export default HomeScreen;


