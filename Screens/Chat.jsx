import {
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {
  useLayoutEffect,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import SendIcon from 'react-native-vector-icons/Ionicons';
import UploadIcon from 'react-native-vector-icons/Ionicons';
import {UserContext} from '../Context/context';
import ReceiverCont from './Components/ReceiverCont';
import SenderCont from './Components/SenderCont';
import CryptoJS from 'react-native-crypto-js';
import uuid from 'react-native-uuid';
import firestore from '@react-native-firebase/firestore';
import axios from 'react-native-axios';
import {SERVER_KEY} from '../Config';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
const Chat = ({route, navigation}) => {
  const [uploading, setUploading] = useState(false);
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
              justifyContent: 'center',
              marginLeft: -20,
              marginVertical: 14,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('ImageViewer', {
                  image: route.params.image,
                  name: route.params.name,
                  username: route.params.username,
                })
              }>
              <Image
                source={{
                  uri: route.params.image,
                }}
                style={styles.navAvatar}
              />
            </TouchableOpacity>
            <View style={{marginLeft: 14}}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Montserrat-SemiBold',
                  color: 'black',
                }}>
                {route.params.name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Montserrat-Medium',
                  color: 'black',
                }}>
                @{route.params.username}
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
    const payload = {
      data: {
        name: contextData.data.name,
        image: contextData.data.image,
        uid: contextData.data.uid,
        username: contextData.data.username,
      },
      notification: {
        body: message ? message : 'Sent You An Image',
        title: contextData.data.name,
      },
      to: user._data.token,
    };

    const headers = {
      Authorization: `key=${SERVER_KEY}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(
        'https://fcm.googleapis.com/fcm/send',
        payload,
        {headers},
      );
      console.log('Notification sent:', response.data);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const sendMessageHandler = () => {
    if (message) {
      sendNotification('text');
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
    }
  };
  const sendMediaHandler = link => {
    let encryptMessage = CryptoJS.AES.encrypt(
      'Sent You An Image',
      combinedId,
    ).toString();
    sendNotification('media');
    firestore()
      .collection('chats')
      .doc(combinedId)
      .update({
        messages: firestore.FieldValue.arrayUnion({
          id: uuid.v4(),
          image: link,
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
    setUploading(false);
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

  const selectImageHandler = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
      } else if (response.error) {
        ToastAndroid.show('Image Select Error', ToastAndroid.SHORT);
      } else {
        uploadImageHandler(response);
        setUploading(true);
        ToastAndroid.show('Sending...', ToastAndroid.SHORT);
      }
    });
  };

  const uploadImageHandler = response => {
    const reference = storage().ref(`/Users Media/${uuid.v4()}`);
    const imagePath = response.assets[0].uri;
    const uploadTask = reference.putFile(imagePath);
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% complete`);
      },
      error => {
        ToastAndroid.show('Image Upload Error!', ToastAndroid.SHORT);
        console.log('Image upload error:', error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          sendMediaHandler(downloadURL);
        });
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{flex: 1}}>
        <ScrollView
          ref={scrollViewRef}
          style={{flexGrow: 1}}
          contentContainerStyle={{
            paddingHorizontal: 26,
            paddingTop: 20,
            paddingBottom: 10,
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
                    name={contextData.data.name}
                  />
                );
              } else if (chat.senderId === route.params.uid) {
                return (
                  <ReceiverCont
                    chat={chat}
                    combinedId={combinedId}
                    key={chat.id}
                    image={route.params.image}
                    name={route.params.name}
                  />
                );
              }
            })}
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.sendMessageCont}>
        <TextInput
          placeholder="Enter Message Here..."
          style={styles.textInput}
          placeholderTextColor={'#00000080'}
          value={message}
          onSubmitEditing={!uploading && sendMessageHandler}
          onChangeText={text => setMessage(text)}
        />
        {uploading && (
          <ActivityIndicator
            size="small"
            color="#2563eb"
            style={{paddingHorizontal: 10, paddingVertical: 6}}
          />
        )}
        {!uploading && (
          <TouchableOpacity
            style={styles.uploadBtn}
            activeOpacity={0.8}
            onPress={selectImageHandler}>
            <UploadIcon name="attach-outline" color="black" size={28} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.sendBtns}
          activeOpacity={0.8}
          onPress={!uploading && sendMessageHandler}>
          <SendIcon name="send-outline" color="black" size={24} />
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: 'black',
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
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
  uploadBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 6,
  },
  sendBtns: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 16,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 6,
  },
});
