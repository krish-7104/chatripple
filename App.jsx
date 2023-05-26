import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Main from './Screens/Main';
import Login from './Screens/Login';
import Register from './Screens/Register';
import PasswordReset from './Screens/PasswordReset';
import Profile from './Screens/Profile';
import Chat from './Screens/Chat';
import AddFriend from './Screens/AddFriend';
import {UserState} from './Context/context';
import Setting from './Screens/Setting';
import Home from './Screens/Home';

const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <UserState>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Reset Password" component={PasswordReset} />
          <Stack.Screen name="My Profile" component={Profile} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="Add Friend" component={AddFriend} />
        </Stack.Navigator>
      </UserState>
    </NavigationContainer>
  );
};

export default App;
