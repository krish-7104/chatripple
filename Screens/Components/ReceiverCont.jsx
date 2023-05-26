import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import CryptoJS from 'react-native-crypto-js';

const ReceiverCont = ({chat, combinedId, image}) => {
  return (
    <View style={{width: '100%', marginBottom: 16}}>
      <Image
        source={{
          uri: image
            ? image
            : 'https://image.lexica.art/full_jpg/7f973906-7787-4b73-8284-b6c794ec3b0b',
        }}
        style={styles.ReceiveProfile}
      />
      <Text style={styles.ReceiveMessage}>
        {CryptoJS.AES.decrypt(chat.text, combinedId).toString(
          CryptoJS.enc.Utf8,
        )}
      </Text>
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
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 10,
    borderRadius: 10,
    position: 'relative',
    maxWidth: '85%',
    fontSize: 16,
    color: 'black',
  },
  ReceiveMessageTime: {
    fontSize: 12,
    marginTop: 2,
    position: 'absolute',
    bottom: -12,
    color: 'black',
  },
  ReceiveProfile: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 60,
    zIndex: 1,
    top: -5,
    left: -16,
  },
});
