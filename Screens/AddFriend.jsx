import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {useState} from 'react';

const AddFriend = () => {
  const [search, setSearch] = useState('');
  return (
    <SafeAreaView>
      <View>
        <TextInput
          placeholder="Enter Username"
          value={search}
          onChangeText={text => setSearch(text)}
        />
        <TouchableOpacity>
          <Text></Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          alignItems: 'center',
        }}></ScrollView>
    </SafeAreaView>
  );
};

export default AddFriend;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
});
