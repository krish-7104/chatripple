import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import CryptoJS from 'react-native-crypto-js';

const SenderCont = ({chat, combinedId, image}) => {
  return (
    <View
      key={chat.id}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
        marginBottom: 16,
      }}>
      <Image
        source={{
          uri: image
            ? image
            : 'https://image.lexica.art/full_jpg/7f973906-7787-4b73-8284-b6c794ec3b0b',
        }}
        style={styles.SenderProfile}
      />
      <Text style={styles.SenderMessage}>
        {CryptoJS.AES.decrypt(chat.text, combinedId).toString(
          CryptoJS.enc.Utf8,
        )}
      </Text>
      {/* <Text style={styles.SenderMessageTime}>10:00 PM</Text> */}
    </View>
  );
};

export default SenderCont;

const styles = StyleSheet.create({
  SenderMessage: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 16,
    borderRadius: 10,
    position: 'relative',
    maxWidth: '85%',
    fontSize: 16,
    alignSelf: 'flex-end',
    color: 'black',
  },
  SenderMessageTime: {
    fontSize: 12,
    marginTop: 2,
    position: 'absolute',
    bottom: -12,
    color: 'black',
  },
  SenderProfile: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 60,
    zIndex: 1,
    top: -5,
    right: -16,
  },
});
