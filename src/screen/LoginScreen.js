import React, {useState, useEffect} from 'react';
import {Text, TextInput, View, TouchableOpacity, Platform} from 'react-native';
import {StackActions} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const [initializing, setInitializing] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    console.log('LOGIN', user, initializing);
    //return subscriber; // unsubscribe on unmount
  }, []);

  const login = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('LOGIN OK');
        navigation.dispatch(StackActions.replace('Home'));
      })
      .catch(error => {
        alert('Errore nelle credenziali');
        console.error(error);
      });
  };
  if (initializing) return null;
  if (user) {
    navigation.dispatch(StackActions.replace('Home'));
    return null;
  }
  if (!user) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View style={{justifyContent: 'center'}}>
          <Text style={{textAlign: 'center', fontSize: 22, fontWeight: '700'}}>
            FAKEFACE
          </Text>
        </View>
        <View style={{paddingHorizontal: 20, marginTop: 90}}>
          <View
            style={{borderRadius: 10, borderWidth: 1, paddingHorizontal: 3}}>
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
              marginTop: 5,
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
        </View>
        <View
          style={{paddingHorizontal: 20, marginTop: 90, alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(StackActions.replace('Home'))}
            style={{
              backgroundColor: 'blue',
              padding: 8,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 5,
              paddingHorizontal: 100,
            }}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: '700'}}>
              LOGIN
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Login', {
                screen: 'RegisterScreen',
              })
            }
            style={{
              backgroundColor: 'red',
              padding: 8,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 5,
              paddingHorizontal: 50,
            }}>
            <Text style={{color: 'white', fontSize: 18}}>REGISTRATI</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default LoginScreen;
