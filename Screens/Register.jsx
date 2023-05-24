import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
const Register = ({navigation}) => {
  const [value, setValue] = useState({
    email: '',
    password: '',
    username: '',
    name: '',
  });

  const onAuthStateChanged = user => {
    if (user) navigation.replace('Home');
  };
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const registerHandler = () => {
    auth()
      .createUserWithEmailAndPassword(value.email, value.password)
      .then(() => {
        navigation.replace('Profile');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          ToastAndroid.show('Email Already In Use!', ToastAndroid.SHORT);
        } else if (error.code === 'auth/invalid-email') {
          ToastAndroid.show('Email Is Invalid!');
        } else if (error.code === 'auth/weak-password') {
          ToastAndroid.show('Weak Password!');
        } else {
          ToastAndroid.show('Something Went Wrong!', ToastAndroid.SHORT);
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputCont}>
        <Text style={styles.labelText}>Name</Text>
        <TextInput
          value={value.name}
          onChangeText={text => setValue({...value, name: text})}
          style={styles.input}
        />
        <Text style={styles.labelText}>Username</Text>
        <TextInput
          value={value.username}
          onChangeText={text => setValue({...value, username: text})}
          style={styles.input}
        />
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
        style={styles.btnCont}
        activeOpacity={0.4}
        onPress={registerHandler}>
        <Text style={styles.btnText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.4}
        onPress={() => navigation.replace('Login')}>
        <Text style={styles.alreadyText}>Already Have An Account?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Register;

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
    color: '#3266ff',
    fontWeight: '700',
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
