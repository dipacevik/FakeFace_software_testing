import React, {useEffect, useState} from 'react';
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import CardComponent from '../component/CardComponent';
import {StackActions} from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    image:
      'https://images.unsplash.com/photo-1622202210941-5fc06f1d581a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZG9lcnN8ZW58MHx8MHx8&w=1000&q=80',
    datatime: '111111',
    user: 'vik',
    title: 'title',
    subtitle:
      'subtitlesubtitlesubtitlesubtitlesubtitlesubtitlesubtitlesubtitlesubtitlesubtitlesubtitlesubtitlesubtitle',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    image:
      'https://i.pinimg.com/originals/90/e6/d5/90e6d585cc43f2de5ae9c54123836bed.jpg',
    datatime: '1111111',
    user: 'vik',
    title: 'title',
    subtitle: 'subtitle',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    image:
      'https://images.unsplash.com/photo-1540635411836-1d80986c6fa1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHw%3D&w=1000&q=80',
    datatime: '111111111',
    user: 'vik',
    title: 'title',
    subtitle: 'subtitle',
  },
];

const HomeScreen = ({navigation}) => {
  const [posts, setPosts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  //caricamento dei post
  useEffect(() => {
    loadPost();
  }, []);

  const loadPost = () => {
    database()
      .ref(`/posts/`)
      .orderByValue('datatime')
      .on('value', snapshot => {
        if (snapshot.val() != null || snapshot.val() != undefined) {
          const temp = Object.values(snapshot.val());
          temp.sort((a, b) => {
            return new Date(a.datatime) - new Date(b.datatime);
          });
          setPosts(temp);
        } else {
          setPosts([]);
        }
      });
    setIsRefreshing(false);
  };
  const onRefresh = () => {
    //set isRefreshing to true
    setIsRefreshing(true);
    loadPost();
    // and set isRefreshing to false at the end of your callApiMethod()
  };

  const logOut = () => {
    //navigation.dispatch(StackActions.replace('Login'));
    auth()
      .signOut()
      .then(() => navigation.dispatch(StackActions.replace('Login')));
  };

  const renderItem = ({item}) => (
    <CardComponent
      title={item.title}
      subtitle={item.subtitle}
      image={item.image}
      datatime={item.datatime}
      user={item.user}
    />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{justifyContent: 'center', paddingVertical: 10}}>
        <Text style={{textAlign: 'center', fontSize: 22, fontWeight: '700'}}>
          HOME
        </Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
      />

      <View
        style={{
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 30 : 5,
          right: Platform.OS === 'ios' ? 10 : 5,
        }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'NewPostScreen',
            })
          }
          style={{
            backgroundColor: 'red',
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 20, fontWeight: '700'}}>
            NEW
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 55 : 10,
          right: Platform.OS === 'ios' ? 5 : 5,
        }}>
        <TouchableOpacity
          onPress={() => logOut()}
          style={{
            backgroundColor: 'red',
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 20, fontWeight: '700'}}>
            LogOut
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
