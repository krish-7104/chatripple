import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import CryptoJS from 'react-native-crypto-js';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
const ReceiverCont = ({chat, combinedId, image, name}) => {
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
      <FastImage
        source={{
          uri: image,
          priority: FastImage.priority.normal,
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
          <FastImage
            style={styles.receiveImageMessage}
            source={{
              uri: chat.image,
              priority: FastImage.priority.normal,
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
    height: undefined,
    aspectRatio: 1,
    borderRadius: 10,
  },
});
