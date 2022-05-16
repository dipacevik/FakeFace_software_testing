import React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
} from 'react-native';

const CardComponent = ({title, subtitle, image, datatime, user}) => (
  <View style={styles.item}>
    {/* Title e user */}
    <View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={{justifyContent: 'flex-start'}}>
          <Text style={styles.user}>{user}</Text>
        </View>
      </View>
    </View>
    {/* image*/}
    <View style={{paddingVertical: 5}}>
      <Image
        style={{height: 200, resizeMode: 'stretch'}}
        source={{uri: image}}
      />
    </View>
    {/* subtitle e data */}
    <View>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, paddingRight: 3}}>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
          <Text style={styles.datatime}>{datatime}</Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#ebeae8',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '200',
  },
  user: {
    fontSize: 12,
    fontWeight: '200',
    color: 'grey',
  },
  datatime: {
    fontSize: 12,
    fontWeight: '200',
    color: 'grey',
  },
});

export default CardComponent;
