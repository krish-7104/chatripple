import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';

const PasswordReset = () => {
  const [email, setEmail] = useState();
  const [send, setSend] = useState(false);
  const resetLinkHandler = async () => {
    try {
      const res = await auth().sendPasswordResetEmail(email);
      console.log(res);
      setSend(true);
    } catch (error) {
      console.log(error);
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
        <Text style={styles.sendText}>
          Reset Link has been sent, if not received kindly check in the Spam
          Section!
        </Text>
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
    fontSize: 14,
    borderColor: '#D1D5DB',
    borderWidth: 1.4,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  labelText: {
    marginBottom: 4,
  },
  btnCont: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 4,
    elevation: 10,
    marginTop: 14,
  },
  btnText: {
    textAlign: 'center',
    color: '#ffffff',
  },
  sendText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#000',
  },
});
