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
  const [notify, setNotify] = useState();
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setNotify(remoteMessage.notification.title);
    });
    return unsubscribe;
  }, []);
  const contextData = useContext(UserContext);
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
        setNotify();
      }}>
      {data && (
        <FastImage
          style={styles.chatProfile}
          source={{
            uri: data.image,
            priority: FastImage.priority.normal,
          }}
        />
      )}
      <View style={{position: 'relative', width: '85%'}}>
        <Text style={styles.FriendListViewName}>{data && data.name}</Text>
        {data && notify === data.name && (
          <View
            style={{
              backgroundColor: '#2563eb',
              padding: 6,
              borderRadius: 50,
              elevation: 10,
              width: 4,
              right: 2,
              position: 'absolute',
              shadowColor: '#2563eb',
              top: 0,
            }}></View>
        )}
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
