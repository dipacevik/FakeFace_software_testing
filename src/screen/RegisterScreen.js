import React, {useState} from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import {StackActions} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {DotIndicator} from 'react-native-indicators';
const regexEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rPassword, setRPassword] = useState('');
  const [numero, setNumero] = useState('');
  const [name, setName] = useState('');
  const [cognome, setCognome] = useState('');

  const [uploading, setUploading] = useState(false);

  const registerUser = () => {
    //set
    setUploading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        console.log('REGISTRAZIONE ok', user.user.uid);
        //update user into realtime db firebase
        const key = database().ref().push().key;

        let dataUser = {
          id: key,
          name: name,
          cognome: cognome,
          numero: numero,
          email: email,
          password: password,
          uid: user.user.uid,
        };
        console.log('UPDATE', dataUser);
        database()
          .ref('/users/' + user.user.uid)
          .set(dataUser)
          .then(() => {
            setUploading(false);
            navigation.dispatch(StackActions.replace('Home'));
          });
      })
      .catch(error => {
        setUploading(false);
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          alert('That email address is invalid!');
        }

        console.error(error);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View style={{justifyContent: 'center', marginTop: 30}}>
          <Text style={{textAlign: 'center', fontSize: 22, fontWeight: '700'}}>
            REGISTRATI
          </Text>
        </View>
        <View style={{paddingHorizontal: 20, marginTop: 90}}>
          <View
            style={{borderRadius: 10, borderWidth: 1, paddingHorizontal: 3}}>
            <TextInput
              placeholder="Nome"
              keyboardType="email-address"
              value={name}
              onChangeText={text => setName(text)}
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
              marginTop: 3,
            }}>
            <TextInput
              placeholder="Cognome"
              keyboardType="email-address"
              value={cognome}
              onChangeText={text => setCognome(text)}
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
              marginTop: 3,
            }}>
            <TextInput
              placeholder="Numero Telefonico"
              keyboardType="number-pad"
              value={numero}
              onChangeText={text => setNumero(text)}
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
              marginTop: 3,
            }}>
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={text => setEmail(text)}
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
              marginTop: 3,
            }}>
            <TextInput
              placeholder="Password"
              keyboardType="numbers-and-punctuation"
              secureTextEntry
              value={password}
              onChangeText={text => setPassword(text)}
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
              marginTop: 3,
            }}>
            <TextInput
              placeholder="Ripeti Password"
              keyboardType="numbers-and-punctuation"
              secureTextEntry
              value={rPassword}
              onChangeText={text => setRPassword(text)}
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
            disabled={
              !uploading &&
              password.toString() === rPassword.toString() &&
              regexEmail.test(email)
                ? false
                : true
            }
            /* navigation.dispatch(StackActions.replace('Home') */
            onPress={() => registerUser()}
            style={{
              backgroundColor:
                !uploading &&
                password.toString() === rPassword.toString() &&
                regexEmail.test(email)
                  ? 'blue'
                  : 'grey',
              padding: 8,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 5,
              paddingHorizontal: 50,
            }}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: '700'}}>
              REGISTRATI
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={uploading ? true : false}
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: uploading ? 'grey' : 'red',
              padding: 8,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 5,
              paddingHorizontal: 50,
            }}>
            <Text style={{color: 'white', fontSize: 14}}>EXIT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const user = {
  additionalUserInfo: {isNewUser: true},
  user: {
    displayName: null,
    email: 'asdasd@asd.it',
    emailVerified: false,
    isAnonymous: false,
    metadata: [Object],
    phoneNumber: null,
    photoURL: null,
    providerData: [Array],
    providerId: 'firebase',
    tenantId: null,
    uid: '7NeO8itjJEVaExye8dfRF98pIPJ2',
  },
};
