import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function TaskSkeleton() {
  return <View style={styles.skeleton} />
}

const styles = StyleSheet.create({
  skeleton: {
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#D1D3D4',
    width: '100%',
    height: 47,
    paddingHorizontal: 2,
    paddingVertical: 8,
  }
});
