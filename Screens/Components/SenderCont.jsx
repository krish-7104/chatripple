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
        marginBottom: 28,
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
      <Text style={styles.SenderMessageTime}>
        {chat.date.toDate().toString().replace(' GMT+0530', '')}
      </Text>
    </View>
  );
};

export default SenderCont;

const styles = StyleSheet.create({
  SenderMessage: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingLeft: 20,
    paddingRight: 30,
    borderRadius: 10,
    position: 'relative',
    maxWidth: '85%',
    fontSize: 14,
    alignSelf: 'flex-end',
    color: 'white',
    fontFamily: 'Montserrat-Medium',
  },
  SenderMessageTime: {
    fontSize: 10,
    position: 'absolute',
    bottom: -16,
    right: 10,
    color: 'black',
    fontFamily: 'Montserrat-Regular',
  },
  SenderProfile: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 60,
    zIndex: 1,
    top: -10,
    right: -16,
  },
});
