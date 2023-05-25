import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Screens/Home';
import Login from './Screens/Login';
import Register from './Screens/Register';
import PasswordReset from './Screens/PasswordReset';
import Profile from './Screens/Profile';
import Chat from './Screens/Chat';
import AddFriend from './Screens/AddFriend';
import {UserState} from './Context/context';

const App = () => {
  const Stack = createNativeStackNavigator();
  return (
    <UserState>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Reset Password" component={PasswordReset} />
          <Stack.Screen name="My Profile" component={Profile} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="Add Friend" component={AddFriend} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserState>
  );
};

export default App;
