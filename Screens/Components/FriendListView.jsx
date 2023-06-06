import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import {NavigationContext} from '@react-navigation/native';
import CryptoJS from 'react-native-crypto-js';
import {UserContext} from '../../Context/context';
import FastImage from 'react-native-fast-image';
import messaging from '@react-native-firebase/messaging';

const FriendListView = props => {
  const contextData = useContext(UserContext);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (!contextData.notify.includes(remoteMessage.notification.title)) {
        contextData.setNotify(e => [...e, remoteMessage.notification.title]);
      }
    });
    return unsubscribe;
  }, []);
  let combinedId =
    props.chat[1].userInfo.uid > contextData.data.uid
      ? props.chat[1].userInfo.uid + contextData.data.uid
      : contextData.data.uid + props.chat[1].userInfo.uid;
  const navigation = useContext(NavigationContext);
  useEffect(() => {
    getUserData();
  }, []);
  const [data, setData] = useState();
  const getUserData = async () => {
    const userData = await firestore()
      .collection('users')
      .doc(props.chat[1].userInfo.uid)
      .get();
    setData(userData._data);
  };

  return (
    <TouchableOpacity
      style={styles.FriendListViewCont}
      activeOpacity={0.9}
      onPress={() => {
        navigation.navigate('Chat', {
          uid: props.chat[1].userInfo.uid,
          name: data.name,
          image: data.image,
          username: data.username,
        });
        contextData.setNotify(contextData.notify.filter(e => e !== data.name));
      }}>
      {data && contextData.notify.includes(data.name) && (
        <View
          style={{
            backgroundColor: '#2563eb',
            width: 13,
            height: 13,
            right: 12,
            top: 12,
            position: 'absolute',
            shadowColor: '#2563eb',
            borderRadius: 50,
            elevation: 30,
          }}></View>
      )}
      {data && (
        <FastImage
          style={styles.chatProfile}
          source={{
            uri: data.image,
            priority: FastImage.priority.normal,
          }}
        />
      )}
      <View>
        <Text style={styles.FriendListViewName}>{data && data.name}</Text>
        <Text style={styles.FriendListViewLastMsg}>
          {data &&
          CryptoJS.AES.decrypt(props.chat[1].lastMessage, combinedId).toString(
            CryptoJS.enc.Utf8,
          ).length <= 30
            ? CryptoJS.AES.decrypt(
                props.chat[1].lastMessage,
                combinedId,
              ).toString(CryptoJS.enc.Utf8)
            : CryptoJS.AES.decrypt(props.chat[1].lastMessage, combinedId)
                .toString(CryptoJS.enc.Utf8)
                .slice(0, 30) + '...'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FriendListView;

const styles = StyleSheet.create({
  FriendListViewCont: {
    backgroundColor: 'white',
    padding: 8,
    width: '92%',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    elevation: 4,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  chatProfile: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  FriendListViewName: {
    fontSize: 17,
    marginLeft: 12,
    color: 'black',
    fontFamily: 'Montserrat-SemiBold',
  },
  FriendListViewLastMsg: {
    fontSize: 14,
    marginLeft: 12,
    marginTop: 1,
    color: '#00000090',
    fontFamily: 'Montserrat-Medium',
  },
});
