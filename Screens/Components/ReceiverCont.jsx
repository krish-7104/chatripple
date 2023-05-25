import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';

const ReceiverCont = () => {
  return (
    <View style={{width: '100%', marginBottom: 16}}>
      <Image
        source={{
          uri: 'https://image.lexica.art/full_jpg/7f973906-7787-4b73-8284-b6c794ec3b0b',
        }}
        style={styles.ReceiveProfile}
      />
      <Text style={styles.ReceiveMessage}>
        Krishsdffsfdsfsfsffsfsfsfsfsfsffsf
      </Text>
      {/* <Text style={styles.ReceiveMessageTime}>10:00 PM</Text> */}
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
    fontSize: 12,
  },
  ReceiveMessageTime: {
    fontSize: 8,
    marginTop: 2,
    position: 'absolute',
    bottom: -12,
  },
  ReceiveProfile: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 60,
    zIndex: 1,
    top: -5,
    left: -16,
  },
});
