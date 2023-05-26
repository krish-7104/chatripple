import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useLayoutEffect} from 'react';

const Home = ({navigation}) => {
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
