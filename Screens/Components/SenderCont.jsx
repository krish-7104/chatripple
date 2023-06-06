import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import CryptoJS from 'react-native-crypto-js';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const SenderCont = ({chat, combinedId, image, name}) => {
  const navigation = useNavigation();
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
      <FastImage
        source={{
          uri: image,
          priority: FastImage.priority.normal,
        }}
        style={styles.SenderProfile}
      />
      {chat.text && (
        <Text style={styles.SenderMessage}>
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
            style={styles.senderImageMessage}
            source={{
              uri: chat.image,
              priority: FastImage.priority.normal,
            }}
          />
        </TouchableOpacity>
      )}
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

  senderImageMessage: {
    width: 220,
    height: undefined,
    aspectRatio: 1,
    borderRadius: 10,
  },
});
