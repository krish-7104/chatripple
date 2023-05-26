import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useLayoutEffect, useContext, useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from '../Context/context';
import GoogleIcon from 'react-native-vector-icons/Ionicons';
const Home = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const contextData = useContext(UserContext);
  const onAuthStateChanged = async user => {
    if (user) {
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
    setLoading(false);
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
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.appName}>Chat Ripple</Text>
      <Text style={styles.subTitle}>End To End Decryption</Text>
      {!loading && (
        <View style={styles.btnArea}>
          <TouchableOpacity
            style={styles.btnCont}
            activeOpacity={0.6}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnCont}
            activeOpacity={0.6}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.btnText}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnGoogleCont} activeOpacity={0.6}>
            <Text style={styles.btnGoogleText}>Continue With</Text>
            <GoogleIcon name="logo-google" size={20} color="black" />
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.footerText}>Developed By Krish Jotaniya</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  logo: {
    width: 90,
    height: 90,
    marginBottom: 18,
  },
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
  btnGoogleCont: {
    backgroundColor: '#fff',
    width: '70%',
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 14,
    marginTop: 16,
    shadowColor: '#2563eb40',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnGoogleText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    marginRight: 8,
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
