import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

const ChatView = ({chat}) => {
  useEffect(() => {
    getUserData();
  }, []);
  const [data, setData] = useState();
  const getUserData = async () => {
    const userData = await firestore()
      .collection('users')
      .doc(chat[1].userInfo.uid)
      .get();
    setData(userData._data);
  };

  return (
    <View style={styles.chatViewCont}>
      {data && (
        <Image
          source={{
            uri: data && data.image,
          }}
          style={styles.chatProfile}
        />
      )}
      <View>
        <Text style={styles.chatViewName}>{data && data.name}</Text>
        <Text style={styles.chatViewLastMsg}>
          {data && chat[1].lastMessage}
        </Text>
      </View>
    </View>
  );
};

export default ChatView;

const styles = StyleSheet.create({
  chatViewCont: {
    backgroundColor: 'white',
    padding: 8,
    width: '96%',
    borderRadius: 10,
    paddingHorizontal: 12,
    elevation: 4,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  chatProfile: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  chatViewName: {
    fontSize: 16,
    marginLeft: 12,
    color: 'black',
  },
  chatViewLastMsg: {
    fontSize: 13,
    marginLeft: 12,
  },
});
