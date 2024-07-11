import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen'; 
import ProductScreen from './ProductScreen';
import { StyleSheet, Image } from 'react-native'; 

const Tab = createBottomTabNavigator();

const Navigation1 = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <Image style={styles.homeicon} source={require('./images/home.png')} /> 
          ),
          tabBarLabel: 'Home',headerShown:false
        }}
      />
      <Tab.Screen name="ProductScreen" component={ProductScreen} 
      options={{
        tabBarIcon: () => (
          <Image style={styles.homeicon} source={require('./images/product.png')} /> 
        ),
        tabBarLabel: 'Product',headerShown:false
      }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  homeicon: {
    width: '20%', 
    height: 24,
    resizeMode: 'contain' 
  }
});

export default Navigation1;
