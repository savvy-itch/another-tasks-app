import { allThemes, BASE_FONT_SIZE, INDICATOR_SIZE } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function RadioButton({ text, val }: { text: string, val: number }) {
  const { fontSize, curTheme, setFontSizePref } = useGeneral();

  return (
    <Pressable
      style={styles.radio}
      onPress={() => setFontSizePref(val)}
    >
      <View style={[styles.radioIndicator, { borderColor: allThemes[curTheme].textColor }]}>
        {/* wrapper is needed to guarantee border radius when radio is toggled */}
        <View style={{ borderRadius: (INDICATOR_SIZE * 0.4) / 2, overflow: 'hidden' }}>
          <View style={[styles.indicatorCore, fontSize === val && { backgroundColor: allThemes[curTheme].textColor }]} />
        </View>
      </View>
      <Text style={{ fontSize: BASE_FONT_SIZE * val, color: allThemes[curTheme].textColor }}>{text}</Text>
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
    borderWidth: 2,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorCore: {
    width: INDICATOR_SIZE * 0.4,
    height: INDICATOR_SIZE * 0.4,
    borderRadius: (INDICATOR_SIZE * 0.4) / 2,
  }
})
