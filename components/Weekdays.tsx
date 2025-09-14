import React, { memo } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';

const weekdays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Weekdays = memo(function Weekdays() {
  return (
    <FlatList 
      data={weekdays}
      renderItem={({item}) => <Text style={{ width: 36, textAlign: 'center' }}>{item}</Text>}
      keyExtractor={item => item}
      numColumns={7}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      contentContainerStyle={styles.weekdays}
    />
  )
})

const styles = StyleSheet.create({
  weekdays: {
    padding: 3,
  },
});

export default Weekdays;
