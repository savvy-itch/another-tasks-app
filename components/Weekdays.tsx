import { allThemes, DAY_BTN_SIZE } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import { useTranslation } from '@/hooks/useTranslation';
import React, { memo } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';

const Weekdays = memo(function Weekdays() {
  const {curTheme} = useGeneral();
  const i18n = useTranslation();

  return (
    <FlatList 
      data={i18n.t("weekdays")}
      renderItem={({item}) => <Text style={{ width: DAY_BTN_SIZE, textAlign: 'center', color: allThemes[curTheme].textColor }}>{item}</Text>}
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
