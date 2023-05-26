import {
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {
  useLayoutEffect,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import SendIcon from 'react-native-vector-icons/Ionicons';
import {UserContext} from '../Context/context';
import ReceiverCont from './Components/ReceiverCont';
import SenderCont from './Components/SenderCont';
import CryptoJS from 'react-native-crypto-js';
import uuid from 'react-native-uuid';
import firestore from '@react-native-firebase/firestore';
import axios from 'react-native-axios';
const Chat = ({route, navigation}) => {
  const contextData = useContext(UserContext);
  const [chats, setChats] = useState([]);
  const scrollViewRef = useRef(null);
  const [message, setMessage] = useState('');
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Second Page',
      headerTitle: () => {
        return (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: -28,
            }}>
            <Image
              source={{
                uri: route.params.image,
              }}
              style={styles.navAvatar}
            />
            <View style={{marginLeft: 6}}>
              <Text
                style={{
                  fontSize: 15,
                }}>
                {route.params.name}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                }}>
                {route.params.username}
              </Text>
            </View>
          </View>
        );
      },
    });
  }, [navigation]);

  let combinedId =
    route.params.uid > contextData.data.uid
      ? route.params.uid + contextData.data.uid
      : contextData.data.uid + route.params.uid;

  const sendNotification = async () => {
    const user = await firestore()
      .collection('tokens')
      .doc(route.params.uid)
      .get();
    var data = JSON.stringify({
      data: {},
      notification: {
        body: message,
        title: route.params.name,
      },
      to: user._data.token,
    });
    var config = {
      method: 'post',
      url: 'https://fcm.googleapis.com/fcm/send',
      headers: {
        Authorization: 'key=',
        'Content-Type': 'application/json',
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const sendMessageHandler = () => {
    sendNotification();
    let encryptMessage = CryptoJS.AES.encrypt(message, combinedId).toString();
    firestore()
      .collection('chats')
      .doc(combinedId)
      .update({
        messages: firestore.FieldValue.arrayUnion({
          id: uuid.v4(),
          text: encryptMessage,
          senderId: contextData.data.uid,
          date: firestore.Timestamp.now(),
        }),
      });
    firestore()
      .collection('userChats')
      .doc(contextData.data.uid)
      .update({
        [combinedId + '.lastMessage']: encryptMessage,
        [combinedId + '.date']: firestore.FieldValue.serverTimestamp(),
      });
    firestore()
      .collection('userChats')
      .doc(route.params.uid)
      .update({
        [combinedId + '.lastMessage']: encryptMessage,
        [combinedId + '.date']: firestore.FieldValue.serverTimestamp(),
      });
    setMessage('');
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      .doc(combinedId)
      .onSnapshot(documentSnapshot => {
        setChats(documentSnapshot.data().messages);
      });
    return () => subscriber();
  }, [contextData.data.uid]);

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({animated: true});
  }, [chats]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={{flexGrow: 1}}
        contentContainerStyle={{
          paddingHorizontal: 26,
          paddingVertical: 16,
          flexGrow: 1,
          alignItems: 'flex-start',
        }}>
        {chats &&
          chats.map(chat => {
            if (chat.senderId === contextData.data.uid) {
              return (
                <SenderCont
                  key={chat.id}
                  chat={chat}
                  combinedId={combinedId}
                  image={contextData.data.image}
                />
              );
            } else if (chat.senderId === route.params.uid) {
              return (
                <ReceiverCont
                  chat={chat}
                  combinedId={combinedId}
                  key={chat.id}
                  image={route.params.image}
                />
              );
            }
          })}
      </ScrollView>
      <View style={styles.sendMessageCont}>
        <TextInput
          placeholder="Enter Message Here.."
          style={styles.textInput}
          value={message}
          onChangeText={text => setMessage(text)}
        />
        <TouchableOpacity
          style={styles.sendBtns}
          activeOpacity={0.8}
          onPress={sendMessageHandler}>
          <SendIcon name="send-outline" color="black" size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  navAvatar: {
    width: 40,
    height: 40,
    borderRadius: 60,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  sendMessageCont: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    elevation: 10,
  },
  sendBtns: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    backgroundColor: '#f2f2f2',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 6,
  },
  space: {
    padding: 10,
  },
});
