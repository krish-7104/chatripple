import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ToastAndroid,
  Keyboard,
} from 'react-native';
import React, {useContext, useLayoutEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from '../Context/context';
import messaging from '@react-native-firebase/messaging';

const Login = ({navigation}) => {
  const [value, setValue] = useState({
    email: '',
    password: '',
  });
  const contextData = useContext(UserContext);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Second Page',
      headerTitle: () => {
        return (
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Montserrat-SemiBold',
              color: 'black',
              marginLeft: -16,
            }}>
            Login - Chat Ripple
          </Text>
        );
      },
    });
  }, [navigation]);
  const getDataFromFirebase = async uid => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    firestore().collection('tokens').doc(uid).set({
      token,
    });
    const user = await firestore().collection('users').doc(uid).get();
    contextData.setData({...contextData.data, ...user._data, uid});
    const user1 = await firestore().collection('userChats').doc(uid).get();
    if (!user1._exists) {
      firestore().collection('userChats').doc(uid).set({});
    }
    navigation.replace('Home');
  };

  const loginHandler = async () => {
    if (value.email) {
      auth()
        .signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          getDataFromFirebase(res.user.uid);
        })
        .catch(error => {
          Keyboard.dismiss();
          if (
            error.code === 'auth/wrong-password' ||
            error.code === 'auth/user-not-found'
          ) {
            ToastAndroid.show('Invalid Credentials!', ToastAndroid.SHORT);
          } else if (error.code === 'auth/too-many-requests') {
            ToastAndroid.show(
              'To Many Attempts, Try Later!',
              ToastAndroid.SHORT,
            );
          } else if (error.code === 'auth/user-disabled') {
            ToastAndroid.show(
              'User Disabled! Contact Developer',
              ToastAndroid.SHORT,
            );
          } else {
            Keyboard.dismiss();
            ToastAndroid.show('Something Went Wrong!', ToastAndroid.SHORT);
          }
        });
    } else {
      Keyboard.dismiss();
      ToastAndroid.show('Enter Email Address!', ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputCont}>
        <Text style={styles.labelText}>Email Address</Text>
        <TextInput
          value={value.email}
          onChangeText={text => setValue({...value, email: text})}
          style={styles.input}
        />
        <Text style={styles.labelText}>Password</Text>
        <TextInput
          secureTextEntry
          value={value.password}
          onChangeText={text => setValue({...value, password: text})}
          style={styles.input}
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.4}
        onPress={() => navigation.navigate('Reset Password')}>
        <Text style={styles.forgetText}>Forget Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnCont}
        activeOpacity={0.4}
        onPress={loginHandler}>
        <Text style={styles.btnText}>Login Now!</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.4}
        onPress={() => navigation.replace('Register')}>
        <Text style={styles.alreadyText}>Don't Have An Account?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputCont: {
    width: '85%',
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    borderColor: '#9ca3af',
    borderWidth: 1.4,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    color: '#000',
    fontFamily: 'Montserrat-Medium',
  },
  forgetText: {
    fontSize: 14,
    paddingBottom: 12,
    textAlign: 'right',
    width: '100%',
    color: '#2563eb',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  labelText: {
    marginBottom: 4,
    color: '#000',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  btnCont: {
    backgroundColor: '#2563eb',
    width: '85%',
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 14,
    shadowColor: '#2563eb',
  },
  btnText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
  },
  alreadyText: {
    marginTop: 20,
    color: '#000',
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
  },
});
