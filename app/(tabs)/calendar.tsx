import CustomDatePicker from '@/components/CustomDatePicker';
import { MAIN_BG } from '@/globals';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Calendar() {
  return (
    <View style={styles.mainContainer}>
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
    backgroundColor: MAIN_BG,
  }
});
