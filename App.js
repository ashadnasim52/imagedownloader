import React, {useState} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Button,
  ActivityIndicator,
  ToastAndroid,
  Alert,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';

const App = () => {
  const [loading, setLoading] = useState(false);

  const actualDownload = () => {
    setLoading(true);
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'png',
    })
      .fetch(
        'GET',
        'https://cdn.pixabay.com/photo/2014/12/21/23/34/cherry-575547_960_720.png',
        {},
      )
      .then((res) => {
        CameraRoll.saveToCameraRoll(res.data, 'photo')
          .then((res) => {
            console.log(res);

            setLoading(false);

            console.log(res);
            ToastAndroid.showWithGravity(
              'Your file has been downloaded to downloads folder!',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        alert(err);
      });
  };
  const downloadFile = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to memory to download the file ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        actualDownload();
      } else {
        Alert.alert(
          'Permission Denied!',
          'You need to give storage permission to download the file',
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View>
      <Text> Download Files in Android </Text>
      <Button onPress={() => downloadFile()} title="Download" />
      {loading ? <ActivityIndicator size="small" color="#0000ff" /> : null}
    </View>
  );
};

export default App;
