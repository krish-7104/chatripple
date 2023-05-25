import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';

const SenderCont = () => {
  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
      }}>
      <Image
        source={{
          uri: 'https://image.lexica.art/full_jpg/7f973906-7787-4b73-8284-b6c794ec3b0b',
        }}
        style={styles.SenderProfile}
      />
      <Text style={styles.SenderMessage}>
        Krishsdffsfdsfsfsffsfsfsfsfsfsffsf
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
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  SenderMessageTime: {
    fontSize: 8,
    marginTop: 2,
    position: 'absolute',
    bottom: -12,
  },
  SenderProfile: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 60,
    zIndex: 1,
    top: -5,
    right: -16,
  },
});
