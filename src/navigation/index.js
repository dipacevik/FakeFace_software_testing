import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screen/HomeScreen';
import LoginScreen from '../screen/LoginScreen';
import PostScreen from '../screen/PostScreen';
import RegisterScreen from '../screen/RegisterScreen';

const StackLogin = createNativeStackNavigator();
const StackHome = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

const LoginNavigation = () => {
  return (
    <StackLogin.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{headerShown: false}}>
      <StackLogin.Screen name="LoginScreen" component={LoginScreen} />
      <StackLogin.Screen name="RegisterScreen" component={RegisterScreen} />
    </StackLogin.Navigator>
  );
};

const HomeNavigation = () => {
  return (
    <StackHome.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{headerShown: false}}>
      <StackHome.Screen name="HomeScreen" component={HomeScreen} />
      <StackHome.Screen name="NewPostScreen" component={PostScreen} />
    </StackHome.Navigator>
  );
};

const NavigationApp = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginNavigation} />
        <Stack.Screen name="Home" component={HomeNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationApp;
