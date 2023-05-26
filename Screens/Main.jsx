import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Button,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useContext, useState, useLayoutEffect} from 'react';
import FriendListView from './Components/FriendListView';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from '../Context/context';
import {PermissionsAndroid} from 'react-native';
import AddFriend from 'react-native-vector-icons/MaterialIcons';
import SettingIcon from 'react-native-vector-icons/Ionicons';

const Main = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Main',
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
        return (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingRight: 8,
            }}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.navigate('My Profile')}
              style={{paddingRight: 12}}>
              <Image
                source={{
                  uri: contextData.data.image
                    ? contextData.data.image
                    : 'https://ui-avatars.com/api/?name=Chat+Ripple&size=512&rounded=true`',
                }}
                style={styles.chatProfile}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.navigate('Setting')}>
              <SettingIcon name="settings-outline" color="black" size={24} />
            </TouchableOpacity>
          </View>
        );
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

export default Main;

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
  chatProfile: {
    width: 40,
    height: 40,
    borderRadius: 50,
    paddingRight: 8,
  },
});
