import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from '../Context/context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Profile = ({navigation}) => {
  const contextData = useContext(UserContext);
  const [value, setValue] = useState({
    name: '',
    email: '',
    username: '',
    image: '',
  });
  useEffect(() => {
    setValue({
      name: contextData.data.name,
      email: contextData.data.email,
      image: contextData.data.image,
      username: contextData.data.username,
    });
  }, [contextData]);

  const saveChangesHandler = async () => {
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
          email: value.email ? value.email : '',
          image: value.image ? value.image : '',
          username: value.username ? value.username : '',
        })
        .then(() => {
          ToastAndroid.show('Profile Updated', ToastAndroid.SHORT);
          navigation.replace('Home');
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
      email: value.email,
      image: value.image,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileCont}>
        <Image
          source={require('../assets/noImage.png')}
          style={styles.profile}
        />
        <TouchableOpacity style={styles.uploadImageBtn} activeOpacity={0.4}>
          <Text style={styles.uploadImageText}>Upload Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputCont}>
        <Text style={styles.labelText}>Username</Text>
        <TextInput
          value={value.username}
          onChangeText={text => setValue({...value, username: text})}
          style={styles.input}
        />
        <Text style={styles.labelText}>Display Name</Text>
        <TextInput
          value={value.name}
          onChangeText={text => setValue({...value, name: text})}
          style={styles.input}
        />
        <Text style={styles.labelText}>Email Address</Text>
        <TextInput
          value={value.email}
          onChangeText={text => setValue({...value, email: text})}
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
    flexDirection: 'row',
  },
  profile: {
    width: 80,
    height: 80,
  },
  inputCont: {
    width: '85%',
    marginVertical: 14,
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
  uploadImageBtn: {
    backgroundColor: '#bfdbfe',
    borderRadius: 6,
    borderWidth: 1.2,
    borderColor: '#2563eb',
  },
  uploadImageText: {
    color: '#2563eb',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  btnCont: {
    backgroundColor: '#2563eb',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 4,
    elevation: 10,
    marginTop: 10,
  },
  btnText: {
    textAlign: 'center',
    color: '#ffffff',
  },
});
