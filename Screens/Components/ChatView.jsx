import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const ChatView = () => {
  return (
    <View style={styles.chatViewCont}>
      <Image
        source={{
          uri: 'https://image.lexica.art/full_jpg/38d04e3b-77e1-4cb9-9bb4-fb99cda8b522',
        }}
        style={styles.chatProfile}
      />
      <View>
        <Text style={styles.chatViewName}>Krish Jotaniya</Text>
        <Text style={styles.chatViewLastMsg}>Krish Jotaniya</Text>
      </View>
    </View>
  );
};

export default ChatView;

const styles = StyleSheet.create({
  chatViewCont: {
    backgroundColor: 'white',
    padding: 8,
    width: '96%',
    borderRadius: 10,
    paddingHorizontal: 12,
    elevation: 4,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  chatProfile: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  chatViewName: {
    fontSize: 16,
    marginLeft: 12,
    color: 'black',
  },
  chatViewLastMsg: {
    fontSize: 13,
    marginLeft: 12,
  },
});
