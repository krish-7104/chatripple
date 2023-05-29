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
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const Profile = ({navigation}) => {
  const contextData = useContext(UserContext);
  const [value, setValue] = useState({
    name: '',
    username: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setValue({
      name: contextData.data.name,
      image: contextData.data.image
        ? contextData.data.image
        : `https://ui-avatars.com/api/?name=${
            contextData.data.name ? contextData.data.name : 'Chat Ripple'
          }&size=512&rounded=true`,
      username: contextData.data.username,
    });
    console.log(contextData.data);
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
            name: value.name,
            image: value.image,
            username: value.username,
            date: firestore.Timestamp.now(),
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
          firestore().collection('userChats').doc(contextData.data.uid).set({});
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
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    } else {
      ToastAndroid.show('Enter All Details!', ToastAndroid.SHORT);
    }
  };

  const uploadImageHandler = response => {
    const reference = storage().ref(`/Profile Images/${contextData.data.uid}`);
    const imagePath = response.assets[0].uri;
    const uploadTask = reference.putFile(imagePath);
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% complete`);
      },
      error => {
        console.log('Image upload error:', error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          setValue({...value, image: downloadURL});
          contextData.setData({
            ...contextData.data,
            username: value.username,
            name: value.name,
            image: downloadURL,
          });
          setLoading(false);
        });
      },
    );
  };

  const selectImageHandler = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
      } else if (response.error) {
        console.log('Image upload error:', response.error);
      } else {
        setLoading(true);
        uploadImageHandler(response);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileCont}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('ImageViewer', {
              image: value.image,
              name: value.name,
              username: value.username,
            })
          }>
          <Image
            source={{
              uri: value.image
                ? value.image
                : `https://ui-avatars.com/api/?name=Chat+Ripple&size=512&rounded=true`,
            }}
            style={styles.profile}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.uploadImageBtn}
          activeOpacity={0.4}
          onPress={!loading && selectImageHandler}>
          {!loading && (
            <Text style={styles.uploadImageText}>Upload New Profile</Text>
          )}
          {loading && <Text style={styles.uploadImageText}>Uploading...</Text>}
        </TouchableOpacity>
      </View>
      <View style={styles.inputCont}>
        <Text style={styles.labelText}>Username</Text>
        <TextInput
          autoCapitalize="none"
          value={value.username}
          onChangeText={text =>
            setValue({...value, username: text.toLowerCase().replace(' ', '')})
          }
          style={styles.input}
        />
        <Text style={styles.labelText}>Display Name</Text>
        <TextInput
          value={value.name}
          onChangeText={text => setValue({...value, name: text})}
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
    fontSize: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
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
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
});
