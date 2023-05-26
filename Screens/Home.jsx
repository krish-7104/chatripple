import {SafeAreaView, StyleSheet, ScrollView, Button} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import FriendListView from './Components/FriendListView';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from '../Context/context';

const Home = ({navigation}) => {
  const contextData = useContext(UserContext);
  const [chats, setChat] = useState();
  const onAuthStateChanged = async user => {
    if (!user) navigation.replace('Register');
    else {
      const userData = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();
      contextData.setData({
        ...contextData.data,
        ...userData._data,
        uid: user.uid,
      });
      // getChatsHandler(user.uid);
    }
  };
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    const subscriber = firestore()
      .collection('userChats')
      .doc(contextData.data.uid)
      .onSnapshot(documentSnapshot => {
        setChat(documentSnapshot.data());
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [contextData.data.uid]);

  return (
    <SafeAreaView>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          alignItems: 'center',
          height: '100%',
        }}>
        {chats &&
          Object.entries(chats).map(chat => {
            return <FriendListView key={chat[0]} chat={chat} />;
          })}
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
