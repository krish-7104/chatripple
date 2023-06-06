import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ToastAndroid,
} from 'react-native';
import React, {useState, useLayoutEffect} from 'react';
import auth from '@react-native-firebase/auth';

const PasswordReset = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Reset Password',
      headerTitle: () => {
        return (
          <Text
            style={{
              fontSize: 18,
              position: 'absolute',
              left: -20,
              fontFamily: 'Montserrat-SemiBold',
              color: 'black',
            }}>
            Reset Password - Chat Ripple
          </Text>
        );
      },
    });
  }, [navigation]);
  const [email, setEmail] = useState();
  const [send, setSend] = useState(false);
  const resetLinkHandler = async () => {
    if (email) {
      try {
        const res = await auth().sendPasswordResetEmail(email);
        ToastAndroid.show(
          'Reset Password Link Sent Successfully!',
          ToastAndroid.LONG,
        );
        navigation.navigate('Login');
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.inputCont}>
        <Text style={styles.labelText}>Email Address</Text>
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.btnCont}
          activeOpacity={0.4}
          onPress={resetLinkHandler}>
          <Text style={styles.btnText}>Send Reset Link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PasswordReset;

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
    width: '100%',
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 8,
    elevation: 14,
    shadowColor: '#2563eb',
  },
  btnText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  sendText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#000',
  },
});
