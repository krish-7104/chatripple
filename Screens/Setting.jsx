import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Linking,
} from 'react-native';
import React, {useEffect, useLayoutEffect} from 'react';
import auth from '@react-native-firebase/auth';

const Setting = ({navigation}) => {
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);
  const onAuthStateChanged = async user => {
    if (!user) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Entry'}],
      });
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Settings',
      headerTitle: () => {
        return (
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Montserrat-SemiBold',
              color: 'black',
            }}>
            Settings - Chat Ripple
          </Text>
        );
      },
    });
  }, [navigation]);
  const logoutHandler = () => {
    auth()
      .signOut()
      .then(() => ToastAndroid.show('Logout Successfully', ToastAndroid.SHORT));
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnCont}
        activeOpacity={0.4}
        onPress={() => Linking.openURL('https://krishjotaniya.live')}>
        <Text style={styles.btnText}>Developer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnCont}
        activeOpacity={0.4}
        onPress={() =>
          Linking.openURL('https://krishjotaniya.live/contactme?ref=chatripple')
        }>
        <Text style={styles.btnText}>Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnCont}
        activeOpacity={0.4}
        onPress={logoutHandler}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCont: {
    backgroundColor: '#2563eb',
    width: '70%',
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 14,
    marginTop: 16,
    shadowColor: '#2563eb',
  },
  btnText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
  },
});
