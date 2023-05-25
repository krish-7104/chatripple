import {SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import ChatView from './Components/ChatView';
import firestore from '@react-native-firebase/firestore';

const Home = ({navigation}) => {
  return (
    <SafeAreaView>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          alignItems: 'center',
          height: '100%',
        }}>
        <ChatView />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
});
