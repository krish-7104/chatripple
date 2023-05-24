import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';

const Login = ({navigation}) => {
  const [value, setValue] = useState({
    email: '',
    password: '',
  });

  const loginHandler = async () => {
    try {
      const res = await auth().signInWithEmailAndPassword(
        value.email,
        value.password,
      );
      navigation.replace('Home');
    } catch (error) {
      console.log(error);
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
