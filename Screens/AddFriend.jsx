import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from '../Context/context';
const AddFriend = ({navigation}) => {
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
              marginLeft: -20,
            }}>
            Add Friend
          </Text>
        );
      },
    });
  }, [navigation]);
  const contextData = useContext(UserContext);
  const [search, setSearch] = useState('');
  useEffect(() => {
    getAllUserhandler();
  }, []);
  const [users, setUser] = useState([]);
  const getAllUserhandler = async () => {
    const users = await firestore().collection('users').get();
    setUser(
      users._docs.filter(
        user => user._data.username !== contextData.data.username,
      ),
    );
  };
  const searchUserHandler = () => {
    Keyboard.dismiss();
    getAllUserhandler();
  };

  const addFriendHandler = async (uid, name, photo) => {
    let combinedId =
      uid > contextData.data.uid
        ? uid + contextData.data.uid
        : contextData.data.uid + uid;
    const user = await firestore().collection('chats').doc(combinedId).get();
    if (!user._exists) {
      firestore().collection('chats').doc(combinedId).set({
        messages: [],
      });
      firestore()
        .collection('userChats')
        .doc(uid)
        .update({
          [combinedId + '.userInfo']: {
            uid: contextData.data.uid,
          },
          [combinedId + '.lastMessage']: '',
        });
      firestore()
        .collection('userChats')
        .doc(contextData.data.uid)
        .update({
          [combinedId + '.userInfo']: {
            uid: uid,
          },
          [combinedId + '.lastMessage']: '',
        });
    }
    navigation.replace('Home');
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchCont}>
        <TextInput
          placeholder="Enter Username"
          value={search}
          onChangeText={text => setSearch(text)}
          style={styles.searchInput}
          placeholderTextColor={'#00000050'}
        />
        <TouchableOpacity
          activeOpacity={0.4}
          style={styles.searchIcon}
          onPress={searchUserHandler}>
          <Icon name="search-outline" color="black" size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.divider}></View>
      {search && (
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
          }}
          style={styles.friendListCont}>
          {users &&
            users.map(user => {
              if (search === user._data.username) {
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.chatViewCont}
                    key={user._data.username}
                    onPress={() =>
                      addFriendHandler(
                        user._ref._documentPath._parts[1],
                        user._data.name,
                        user._data.image,
                      )
                    }>
                    <Image
                      source={{
                        uri: user._data.image,
                      }}
                      style={styles.chatProfile}
                    />
                    <View>
                      <Text style={styles.chatViewName}>{user._data.name}</Text>
                      {/* <Text style={styles.chatViewLastMsg}>
                        {user._data.username}
                      </Text> */}
                    </View>
                  </TouchableOpacity>
                );
              }
            })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AddFriend;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  searchInput: {
    width: '88%',
    fontFamily: 'Montserrat-Medium',
    color: 'black',
    fontSize: 16,
  },
  searchCont: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: '12%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    padding: 1,
    width: '100%',
    backgroundColor: '#d1d5db',
  },
  friendListCont: {
    flex: 1,
    width: '100%',
    marginTop: 10,
  },
  chatViewCont: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    paddingHorizontal: 14,
    elevation: 4,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    flex: 1,
    width: '90%',
  },
  chatProfile: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  chatViewName: {
    fontSize: 18,
    marginLeft: 12,
    color: 'black',
    fontFamily: 'Montserrat-Medium',
  },
});
