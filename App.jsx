import 'react-native-gesture-handler';
import React from 'react';
import Home from './Screens/Home';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Chat from './Screens/Chat';
import AddFriend from './Screens/AddFriend';
import Profile from './Screens/Profile';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
const App = () => {
  const Drawer = createDrawerNavigator();
  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          paddingTop: 80,
        }}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Developer"
          onPress={() => Linking.openURL('https://krishjotaniya.live')}
        />
      </DrawerContentScrollView>
    );
  }
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Login"
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen
          options={{
            drawerItemStyle: {display: 'none'},
            headerLeft: false,
          }}
          name="Login"
          component={Login}
        />
        <Drawer.Screen
          options={{
            drawerItemStyle: {display: 'none'},
            headerLeft: false,
          }}
          name="Register"
          component={Register}
        />
        <Drawer.Screen
          options={{
            drawerItemStyle: {display: 'none'},
          }}
          name="Chat"
          component={Chat}
        />
        <Drawer.Screen name="Add Friend" component={AddFriend} />
        <Drawer.Screen name="My Profile" component={Profile} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
