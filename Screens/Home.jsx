import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useContext} from 'react';
import auth from '@react-native-firebase/auth';
import ChatView from './Components/ChatView';

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
