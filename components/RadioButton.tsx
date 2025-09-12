import { BASE_FONT_SIZE } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const INDICATOR_SIZE = 17;

export default function RadioButton({ text, val }: { text: string, val: number }) {
  const { fontSize, setFontSize } = useGeneral();

  return (
    <Pressable
      style={styles.radio}
      onPress={() => setFontSize(val)}
    >
      <View style={styles.radioIndicator}>
        <View style={fontSize === val && styles.selected} />
      </View>
      <Text style={{ fontSize: BASE_FONT_SIZE * val }}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  radio: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  radioIndicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    width: INDICATOR_SIZE * 0.5,
    height: INDICATOR_SIZE * 0.5,
    backgroundColor: 'blue',
    borderRadius: '50%',
  }
})
