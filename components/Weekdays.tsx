import { allThemes } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import React, { memo } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';

const weekdays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Weekdays = memo(function Weekdays() {
  const {curTheme} = useGeneral();

  return (
    <FlatList 
      data={weekdays}
      renderItem={({item}) => <Text style={{ width: 36, textAlign: 'center', color: allThemes[curTheme].textColor }}>{item}</Text>}
      keyExtractor={item => item}
      numColumns={7}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      contentContainerStyle={styles.weekdays}
    />
  )
})

const styles = StyleSheet.create({
  weekdays: {
    paddingVertical: 7,
  },
});

export default Weekdays;
