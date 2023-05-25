import {SafeAreaView, StyleSheet, ScrollView, Button} from 'react-native';
import React, {useEffect, useContext} from 'react';
import ChatView from './Components/ChatView';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from '../Context/context';

const Home = ({navigation}) => {
  const contextData = useContext(UserContext);
  const onAuthStateChanged = async user => {
    if (!user) navigation.replace('Register');
    else {
      const userData = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();
      contextData.setData({...contextData.data, ...userData._data});
    }
  };
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return (
    <SafeAreaView>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          alignItems: 'center',
          height: '100%',
        }}>
        <Button
          title="Add Friends"
          onPress={() =>
            // auth()
            //   .signOut()
            //   .then(() => console.log('User signed out!'))
            navigation.navigate('Add Friend')
          }
        />
        <ChatView />
        <Button
          title="Logout"
          onPress={() =>
            auth()
              .signOut()
              .then(() => console.log('User signed out!'))
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
});
