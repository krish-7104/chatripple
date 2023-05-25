import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import {NavigationContext} from '@react-navigation/native';

const FriendListView = props => {
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
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('Chat', {
          uid: props.chat[1].userInfo.uid,
          name: data.name,
          image: data.image,
          username: data.username,
        })
      }>
      {data && (
        <Image
          source={{
            uri: data && data.image,
          }}
          style={styles.chatProfile}
        />
      )}
      <View>
        <Text style={styles.FriendListViewName}>{data && data.name}</Text>
        <Text style={styles.FriendListViewLastMsg}>
          {data && props.chat[1].lastMessage}
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
  FriendListViewName: {
    fontSize: 16,
    marginLeft: 12,
    color: 'black',
  },
  FriendListViewLastMsg: {
    fontSize: 13,
    marginLeft: 12,
  },
});
