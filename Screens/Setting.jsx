import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useLayoutEffect} from 'react';
import auth from '@react-native-firebase/auth';

const Setting = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Settings',
      headerTitle: () => {
        return (
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Montserrat-SemiBold',
              color: 'black',
            }}>
            Settings - Chat Ripple
          </Text>
        );
      },
    });
  }, [navigation]);
  const logoutHandler = () => {
    auth()
      .signOut()
      .then(() => navigation.replace('Home'));
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnCont}
        activeOpacity={0.4}
        onPress={logoutHandler}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
