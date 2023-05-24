import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useContext} from 'react';
import auth from '@react-native-firebase/auth';
import {UserContext} from '../Context/context';
const Home = () => {
  const contextData = useContext(UserContext);
  const onAuthStateChanged = user => {
    if (!user) navigation.replace('Register');
    contextData.setData({
      ...contextData.data,
      email: user.email,
      name: user.displayName,
      image: user.photoURL,
      uid: user.uid,
    });
  };
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
