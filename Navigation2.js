import { StyleSheet } from "react-native";
import { createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";
import { useNavigation } from '@react-navigation/native';
import Navigation1 from "./Navigation1";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <DrawerItem 
      label ="Logout"
      onPress={handleLogout} 
      labelStyle={styles.draweritem}
    />
  );
};

const Navigation2 = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Main" component={Navigation1} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
};

const styles=StyleSheet.create({
    draweritem:{
        width:'50%',
        height:60, 
        color:'black',
        marginTop:30,
        fontSize:20,
        fontWeight:'bold',
        padding:16,
        alignSelf:'center',
        backgroundColor:'grey',
        borderRadius:10

    }
})

export default Navigation2;

