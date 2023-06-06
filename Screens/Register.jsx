import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ToastAndroid,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useState, useLayoutEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {UserContext} from '../Context/context';
import firestore from '@react-native-firebase/firestore';

const Register = ({navigation}) => {
  const [value, setValue] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const contextData = useContext(UserContext);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Register',
      headerTitle: () => {
        return (
          <Text
            style={{
              fontSize: 18,
              marginLeft: -16,
              fontFamily: 'Montserrat-SemiBold',
              color: 'black',
            }}>
            Create Account - Chat Ripple
          </Text>
        );
      },
    });
  }, [navigation]);
  const saveChangesHandler = async uid => {
    try {
      firestore()
        .collection('users')
        .doc(uid)
        .set({
          email: value.email ? value.email : '',
        })
        .catch(e => {
          console.log(error);
          ToastAndroid.show('Something Went Wrong!', ToastAndroid.SHORT);
        });
      const user = await firestore().collection('userChats').doc(uid).get();
      if (!user._exists) {
        firestore().collection('userChats').doc(uid).set({});
      }
      ToastAndroid.show('Account Created', ToastAndroid.SHORT);
      contextData.setData({
        ...contextData.data,
        email: value.email,
        uid,
        image: '',
      });
      setLoading(false);
      navigation.replace('My Profile');
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Something Went Wrong!', ToastAndroid.SHORT);
    }
    setValue({email: '', password: '', confirmPassword: ''});
  };

  const registerHandler = () => {
    if (value.password === value.confirmPassword) {
      if (value.email) {
        auth()
          .createUserWithEmailAndPassword(value.email, value.password)
          .then(e => {
            Keyboard.dismiss();
            setLoading(true);
            saveChangesHandler(e.user.uid);
          })
          .catch(error => {
            Keyboard.dismiss();
            if (error.code === 'auth/email-already-in-use') {
              ToastAndroid.show('Email Already In Use!', ToastAndroid.SHORT);
            } else if (error.code === 'auth/invalid-email') {
              ToastAndroid.show('Email Is Invalid!', ToastAndroid.SHORT);
            } else if (error.code === 'auth/weak-password') {
              ToastAndroid.show('Weak Password!', ToastAndroid.SHORT);
            } else {
              ToastAndroid.show('Something Went Wrong!', ToastAndroid.SHORT);
            }
          });
      } else {
        Keyboard.dismiss();
        ToastAndroid.show('Enter Email Address!', ToastAndroid.SHORT);
      }
    } else {
      Keyboard.dismiss();
      ToastAndroid.show('Both Password Are Different!', ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {!loading && (
        <>
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
            <Text style={styles.labelText}>Confirm Password</Text>
            <TextInput
              secureTextEntry
              value={value.confirmPassword}
              onChangeText={text => setValue({...value, confirmPassword: text})}
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
        </>
      )}
      {loading && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator
            size="large"
            color="#2563eb"
            style={{paddingHorizontal: 10, paddingVertical: 6}}
          />
        </View>
      )}
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
