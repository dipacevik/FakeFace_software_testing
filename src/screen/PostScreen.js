import React, {useState, useEffect} from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  SafeAreaView,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import * as Progress from 'react-native-progress';
import moment from 'moment';

import {DotIndicator} from 'react-native-indicators';

export default function PostScreen({navigation}) {
  const [filePath, setFilePath] = useState({uri: ''});
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState();

  const [titolo, setTitolo] = useState('');
  const [testo, setTesto] = useState('');

  //caricamento delle informazioni del cliente all'avvio
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    const test = auth().currentUser;
    console.log(test);
    const subscriber = 'E1zspQSXciUzdX6JdqizDdAswlx2';
    console.log('AVVIO APP');
    database()
      .ref('/users/' + subscriber)
      .once('value')
      .then(snapshot => {
        console.log('User data: ', snapshot.val());
        setUser(snapshot.val());
        console.log(user);
      });
  };
  const uploadAndReturnFirestoreLink = async () => {
    setUploading(true);
    const {uri} = filePath;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    try {
      const imageRef = storage().ref('/image/' + filename);
      await imageRef.putFile(uploadUri);
      const url = await imageRef.getDownloadURL();
      console.log('IMMAGINE CARICATA', url);
      alert('Upload Success', url);
      setUploading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const uploadImage = async () => {
    setUploading(true);
    const {uri} = filePath;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    try {
      const imageRef = storage().ref('/image/' + filename);
      const task = await imageRef.putFile(uploadUri);

      const url = await imageRef.getDownloadURL();
      console.log('IMMAGINE CARICATA', url);
      //caricamento delle informazioni del cliente ok

      //upload into DB  il post

      const key = database().ref().push().key;

      let dataPost = {
        id: key,
        image: url,
        datatime: moment().format('DD MM YYYY, HH:mm:ss'),
        title: titolo,
        subtitle: testo,
        user: user.name,
      };

      console.log('UPDATE', dataPost);
      database()
        .ref('/posts/' + key)
        .set(dataPost)
        .then(() => {
          setUploading(false);
          setFilePath({uri: ''});
          setTitolo('');
          setTesto('');

          Alert.alert('Post uploaded!', 'Your post has been uploaded!');
        });
    } catch (e) {
      Alert.alert('ERRORE!', e);
      console.log(e);
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };
  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };
  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        //console.log('Response = ', response.assets[0]);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        setFilePath(response.assets[0]);
      });
    }
  };
  const chooseFile = type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      //console.log('Response = ', response.assets[0]);

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setFilePath(response.assets[0]);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={{flex: 1}}>
        <View style={{backgroundColor: 'grey'}}>
          <Image
            style={{height: 200, resizeMode: 'contain'}}
            source={{uri: filePath.uri}}
          />
        </View>

        <View style={{alignItems: 'center', marginTop: 10}}>
          <TouchableOpacity
            onPress={() => captureImage('photo')}
            style={{backgroundColor: 'grey', padding: 10, borderRadius: 8}}>
            <Text>Scatta foto</Text>
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center', marginTop: 10}}>
          <TouchableOpacity
            onPress={() => chooseFile('photo')}
            style={{backgroundColor: 'grey', padding: 10, borderRadius: 8}}>
            <Text>Scegli foto</Text>
          </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal: 20, marginTop: 50}}>
          <View
            style={{borderRadius: 10, borderWidth: 1, paddingHorizontal: 3}}>
            <TextInput
              placeholder="Titolo"
              value={titolo}
              onChangeText={text => setTitolo(text)}
              style={{
                paddingVertical: Platform.OS === 'ios' ? 8 : 0,
                paddingHorizontal: Platform.OS === 'ios' ? 3 : 0,
              }}
            />
          </View>
          <View
            style={{
              borderRadius: 10,
              borderWidth: 1,
              paddingHorizontal: 3,
              marginTop: 5,
            }}>
            <TextInput
              placeholder="Testo"
              multiline
              value={testo}
              onChangeText={text => setTesto(text)}
              style={{
                paddingVertical: Platform.OS === 'ios' ? 8 : 0,
                paddingHorizontal: Platform.OS === 'ios' ? 3 : 0,
              }}
            />
          </View>
        </View>
        {uploading && (
          <View style={{marginTop: 50, alignItems: 'center'}}>
            <DotIndicator color="red" animating={uploading} />
          </View>
        )}
        <View
          style={{paddingHorizontal: 20, marginTop: 90, alignItems: 'center'}}>
          <TouchableOpacity
            //onPress={() => navigation.goBack()}
            onPress={uploadImage}
            disabled={
              !uploading &&
              filePath.uri.toString() != 0 &&
              testo.toString() != 0 &&
              titolo.toString() != 0
                ? false
                : true
            }
            style={{
              backgroundColor:
                !uploading &&
                filePath.uri.toString() != 0 &&
                testo.toString() != 0 &&
                titolo.toString() != 0
                  ? 'blue'
                  : 'grey',
              padding: 8,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 5,
              paddingHorizontal: 60,
            }}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: '700'}}>
              AGGIUNGI POST
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            disabled={uploading ? true : false}
            style={{
              backgroundColor: uploading ? 'grey' : 'red',
              padding: 8,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 5,
              paddingHorizontal: 50,
            }}>
            <Text style={{color: 'white', fontSize: 18}}>EXIT</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export const STYLES = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
  },
  // add below
  selectButtonContainer: {
    margin: 20,
    borderRadius: 5,
  },
  selectButtonTitle: {
    padding: 10,
    fontSize: 18,
  },
});

const COLORS = {
  primaryDark: '#22212c',
  primaryLight: '#f8f8f2',
  primaryRed: '#ff5555',
  primaryPink: '#ff80bf',
  primaryYellow: '#ffff80',
  primaryOrange: '#ff9580',
};
