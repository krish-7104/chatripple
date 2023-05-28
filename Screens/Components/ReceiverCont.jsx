import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import CryptoJS from 'react-native-crypto-js';
import {useNavigation} from '@react-navigation/native';
const ReceiverCont = ({chat, combinedId, image}) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginBottom: 28,
      }}>
      <Image
        source={{
          uri: image
            ? image
            : 'https://image.lexica.art/full_jpg/7f973906-7787-4b73-8284-b6c794ec3b0b',
        }}
        style={styles.ReceiveProfile}
      />
      {chat.text && (
        <Text style={styles.ReceiveMessage}>
          {CryptoJS.AES.decrypt(chat.text, combinedId).toString(
            CryptoJS.enc.Utf8,
          )}
        </Text>
      )}
      {chat.image && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('ImageViewer', {
              image: chat.image,
              name,
              date: chat.date.toDate().toString().replace(' GMT+0530', ''),
            })
          }>
          <Image
            style={styles.receiveImageMessage}
            source={{
              uri: chat.image,
            }}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.ReceiveMessageTime}>
        {chat.date.toDate().toString().replace(' GMT+0530', '')}
      </Text>
    </View>
  );
};

export default ReceiverCont;

const styles = StyleSheet.create({
  ReceiveMessage: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingLeft: 30,
    paddingRight: 20,
    borderRadius: 10,
    position: 'relative',
    maxWidth: '85%',
    fontSize: 14,
    color: 'black',
    fontFamily: 'Montserrat-Medium',
  },
  ReceiveMessageTime: {
    fontSize: 10,
    position: 'absolute',
    bottom: -16,
    left: 10,
    color: 'black',
    fontFamily: 'Montserrat-Regular',
  },
  ReceiveProfile: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 60,
    zIndex: 1,
    top: -10,
    left: -16,
  },
  receiveImageMessage: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    borderRadius: 10,
  },
});
