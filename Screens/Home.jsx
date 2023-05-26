import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Button,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useContext, useState, useLayoutEffect} from 'react';
import FriendListView from './Components/FriendListView';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from '../Context/context';
import {PermissionsAndroid} from 'react-native';
import AddFriend from 'react-native-vector-icons/MaterialIcons';
import MenuIcon from 'react-native-vector-icons/Entypo';

const Home = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Home',
      headerTitle: () => {
        return (
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Montserrat-SemiBold',
              color: 'black',
              textAlign: 'center',
            }}>
            Chat Ripple
          </Text>
        );
      },
      headerRight: () => {
        return <MenuIcon name="dots-three-vertical" color="black" size={24} />;
      },
    });
  }, [navigation]);
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
    }
  };
  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
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
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.floatingBtn}
        onPress={() => navigation.navigate('Add Friend')}>
        <AddFriend name="person-add" color="white" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  floatingBtn: {
    position: 'absolute',
    bottom: 35,
    right: 35,
    backgroundColor: '#be123c',
    elevation: 14,
    padding: 16,
    shadowColor: '#be123c',
    borderRadius: 60,
  },
});
