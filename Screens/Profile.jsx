import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Keyboard,
} from 'react-native';
import React, {useContext, useEffect, useState, useLayoutEffect} from 'react';
import {UserContext} from '../Context/context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Profile = ({navigation}) => {
  const contextData = useContext(UserContext);
  const [value, setValue] = useState({
    name: '',
    username: '',
    image: '',
  });

  useEffect(() => {
    setValue({
      name: contextData.data.name,
      image: contextData.data.image,
      username: contextData.data.username,
    });
  }, [contextData]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'My Profile',
      headerTitle: () => {
        return (
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Montserrat-SemiBold',
              color: 'black',
            }}>
            My Profile - Chat Ripple
          </Text>
        );
      },
    });
  }, [navigation]);

  const nameHandler = e => {
    setValue({...value, name: e});
    if (value.image === '') {
      if (value.name) {
        setValue({
          ...value,
          image: `https://ui-avatars.com/api/?name=${value.name}&size=512&rounded=true`,
        });
      } else {
        setValue({
          ...value,
          image: `https://ui-avatars.com/api/?name=Chat+Ripple&size=512&rounded=true`,
        });
      }
    }
  };

  const saveChangesHandler = async () => {
    Keyboard.dismiss();
    if (value.username && value.name) {
      const update = {
        displayName: value.name,
        photoURL: value.image,
      };
      try {
        await auth().currentUser.updateProfile(update);
        firestore()
          .collection('users')
          .doc(contextData.data.uid)
          .set({
            name: value.name ? value.name : '',
            image: value.image ? value.image : '',
            username: value.username ? value.username : '',
          })
          .then(() => {
            ToastAndroid.show('Profile Updated', ToastAndroid.SHORT);
          })
          .catch(e => {
            console.log(error);
            ToastAndroid.show('Something Went Wrong!', ToastAndroid.SHORT);
          });
        const user = await firestore()
          .collection('userChats')
          .doc(contextData.data.uid)
          .get();
        if (!user._exists) {
          firestore().collection('chats').doc(contextData.data.uid).set({});
        }
      } catch (error) {
        console.log(error);
        ToastAndroid.show('Something Went Wrong!', ToastAndroid.SHORT);
      }
      contextData.setData({
        ...contextData.data,
        username: value.username,
        name: value.name,
        image: value.image,
      });
      navigation.replace('Home');
    } else {
      ToastAndroid.show('Enter All Details!', ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileCont}>
        <Image
          source={{
            uri: value.image
              ? value.image
              : `https://ui-avatars.com/api/?name=Chat+Ripple&size=512&rounded=true`,
          }}
          style={styles.profile}
        />
        {/* <TouchableOpacity style={styles.uploadImageBtn} activeOpacity={0.4}>
          <Text style={styles.uploadImageText}>Upload Profile</Text>
        </TouchableOpacity> */}
      </View>
      <View style={styles.inputCont}>
        <Text style={styles.labelText}>Username</Text>
        <TextInput
          autoCapitalize="none"
          value={value.username}
          onChangeText={text => setValue({...value, username: text})}
          style={styles.input}
        />
        <Text style={styles.labelText}>Display Name</Text>
        <TextInput
          value={value.name}
          onChangeText={nameHandler}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.btnCont}
          activeOpacity={0.4}
          onPress={saveChangesHandler}>
          <Text style={styles.btnText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCont: {
    width: '85%',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 36,
  },
  profile: {
    width: 120,
    height: 120,
    marginBottom: 16,
    borderRadius: 60,
  },
  uploadImageBtn: {
    backgroundColor: '#fff',
    borderRadius: 6,
    elevation: 5,
    shadowColor: '#2563eb',
    borderWidth: 1.2,
    borderColor: '#2563eb',
  },
  uploadImageText: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#2563eb',
    fontSize: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
