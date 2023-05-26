import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useLayoutEffect, useContext} from 'react';
import {PermissionsAndroid} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from '../Context/context';

const Home = ({navigation}) => {
  const contextData = useContext(UserContext);
  const onAuthStateChanged = async user => {
    if (!user) navigation.replace('Register');
    else {
      const userData = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();
      contextData.setData({
        ...contextData.data,
        ...userData._data,
        uid: user.uid,
      });
      navigation.replace('Main');
    }
  };
  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Chat Ripple</Text>
      <Text style={styles.subTitle}>End To End Decryption</Text>
      <View style={styles.btnArea}>
        <TouchableOpacity
          style={styles.btnCont}
          activeOpacity={0.4}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnCont}
          activeOpacity={0.4}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.btnText}>Create Account</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>Developed By Krish Jotaniya</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    color: 'black',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 34,
  },
  subTitle: {
    color: '#00000090',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    marginTop: 10,
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
  btnArea: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 60,
  },
  footerText: {
    color: 'black',
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    position: 'absolute',
    bottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
