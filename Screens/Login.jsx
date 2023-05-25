import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from '../Context/context';

const Login = ({navigation}) => {
  const [value, setValue] = useState({
    email: '',
    password: '',
  });

  const onAuthStateChanged = user => {
    // if (user) navigation.replace('Home');
  };
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const contextData = useContext(UserContext);

  const getDataFromFirebase = async uid => {
    const user = await firestore().collection('users').doc(uid).get();
    contextData.setData({...contextData.data, ...user._data});
    navigation.replace('Home');
  };

  const loginHandler = async () => {
    auth()
      .signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        getDataFromFirebase(res.user.uid);
      })
      .catch(error => {
        if (
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/user-not-found'
        ) {
          ToastAndroid.show('Invalid Credentials!', ToastAndroid.SHORT);
        } else if (error.code === 'auth/too-many-requests') {
          ToastAndroid.show('To Many Attempts, Try Later!');
        } else if (error.code === 'auth/user-disabled') {
          ToastAndroid.show('User Disabled! Contact Developer');
        } else {
          ToastAndroid.show('Something Went Wrong!', ToastAndroid.SHORT);
        }
      });
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
        onPress={() => navigation.navigate('Password Reset')}>
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
        onPress={() => navigation.navigate('Register')}>
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
    fontSize: 14,
    borderColor: '#D1D5DB',
    borderWidth: 1.4,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  forgetText: {
    fontSize: 12,
    paddingBottom: 10,
    textAlign: 'right',
    width: '100%',
    color: '#3266ff',
    fontWeight: '600',
  },
  labelText: {
    marginBottom: 4,
  },
  btnCont: {
    backgroundColor: '#2563eb',
    width: '85%',
    paddingVertical: 10,
    borderRadius: 4,
    elevation: 10,
  },
  btnText: {
    textAlign: 'center',
    color: '#ffffff',
  },
  alreadyText: {
    marginTop: 8,
  },
});
