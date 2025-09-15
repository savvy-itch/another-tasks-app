import CustomDatePicker from '@/components/CustomDatePicker';
import { allThemes } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Calendar() {
  const { curTheme } = useGeneral();
  
  return (
    <View style={[styles.mainContainer, { backgroundColor: allThemes[curTheme].mainBg }]}>
      <CustomDatePicker />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  }
});
