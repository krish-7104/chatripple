import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useLayoutEffect} from 'react';
import FastImage from 'react-native-fast-image';

const ImageViewer = ({route, navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Second Page',
      headerTitle: () => {
        return (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: -20,
              marginVertical: 14,
            }}>
            <Image
              source={{
                uri: route.params.image,
              }}
              style={styles.navAvatar}
            />
            <View style={{marginLeft: 14}}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Montserrat-SemiBold',
                  color: 'black',
                }}>
                {route.params.name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Montserrat-Medium',
                  color: 'black',
                }}>
                {route.params.date
                  ? route.params.date
                  : '@' + route.params.username}
              </Text>
            </View>
          </View>
        );
      },
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <FastImage
        style={styles.imageView}
        source={{
          uri: route.params.image,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};

export default ImageViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    flex: 1,
    width: '100%',
    height: null,
  },
});
