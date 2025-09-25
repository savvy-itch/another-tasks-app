import { allThemes } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import { themes } from '@/types';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import dark_theme_icon from "../assets/images/dark_theme_icon.png";
import green_theme_icon from "../assets/images/green_theme_icon.png";
import light_theme_icon from "../assets/images/light_theme_icon.png";

const themeIcons: Record<themes, any> = {
  light: light_theme_icon,
  dark: dark_theme_icon,
  green: green_theme_icon,
};

const INDICATOR_SIZE = 25;

export default function ThemeRadioButton({ val }: { val: themes }) {
  const { curTheme, setThemePref } = useGeneral();

  return (
    <Pressable
      style={[styles.radio, (curTheme === val) && { borderWidth: 3, borderColor: allThemes[curTheme].dayHighlightBg }]}
      onPress={() => setThemePref(val)}
    >
      <Image 
        style={styles.themeIcon}
        source={themeIcons[val]}
        resizeMode='contain'
      />
      <View style={[styles.radioIndicator, curTheme === val && { borderColor: allThemes[curTheme].mainBg } ]}>
        <View style={[curTheme === val && styles.selected, { backgroundColor: allThemes[curTheme].mainBg }]} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  radio: {
    display: 'flex',
    width: '30%',
    aspectRatio: 2/3,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    position: 'relative',
    borderRadius: 13,
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  radioIndicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderWidth: 2,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    top: '4%',
    left: '5%',
  },
  selected: {
    width: INDICATOR_SIZE * 0.5,
    height: INDICATOR_SIZE * 0.5,
    borderRadius: '50%',
  },
  themeIcon: {
    height: '100%',
    width: '100%',
  }
})
