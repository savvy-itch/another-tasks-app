import RadioButton from '@/components/RadioButton';
import ThemeRadioButton from '@/components/ThemeRadioButton';
import { allThemes, BASE_FONT_SIZE } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import { themes } from '@/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Application from 'expo-application';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

const fontSizeCoef = {
  normal: 1,
  big: 1.3,
}

export default function Settings() {
  const { fontSize, curTheme, fetchAppPrefs } = useGeneral();

  useEffect(() => {
    fetchAppPrefs()
  }, [fetchAppPrefs]);

  return (
    <Animated.ScrollView contentContainerStyle={[styles.mainContainer, { backgroundColor: allThemes[curTheme].mainBg }]}>
      <View style={styles.headingWrapper}>
        <FontAwesome name="text-height" size={BASE_FONT_SIZE} color={ allThemes[curTheme].textColor } />
        <Text style={{ fontSize: BASE_FONT_SIZE * fontSize, color: allThemes[curTheme].textColor }}>Font size</Text>
      </View>
      <View style={styles.radioContainer}>
        <RadioButton text="Normal" val={fontSizeCoef.normal} />
        <RadioButton text="Large" val={fontSizeCoef.big} />
      </View>

      <View style={[styles.divider, { borderColor: allThemes[curTheme].textColor, opacity: 0.5 }]} />

      <View style={styles.headingWrapper}>
        <Ionicons name="color-palette" size={BASE_FONT_SIZE} color={ allThemes[curTheme].textColor } />
        <Text style={{ fontSize: BASE_FONT_SIZE * fontSize, color: allThemes[curTheme].textColor }}>Theme</Text>
      </View>
      <View style={styles.radioContainer}>
        {Object.keys(allThemes).map((t) => <ThemeRadioButton key={t} val={t as themes} />)}
      </View>

      <View style={[styles.divider, { borderColor: allThemes[curTheme].textColor, opacity: 0.5 }]} />

      <View style={styles.headingWrapper}>
        <Ionicons name="language" size={BASE_FONT_SIZE} color={ allThemes[curTheme].textColor } />
        <Text style={{ fontSize: BASE_FONT_SIZE * fontSize, color: allThemes[curTheme].textColor }}>Language</Text>
      </View>

      <View style={[styles.divider, { borderColor: allThemes[curTheme].textColor, opacity: 0.5 }]} />

      <View style={styles.headingWrapper}>
        <FontAwesome name="warning" size={BASE_FONT_SIZE} color={ allThemes[curTheme].textColor } />
        <Text style={{ fontSize: BASE_FONT_SIZE * fontSize, color: allThemes[curTheme].textColor }}>Clear data</Text>
      </View>

      <Text style={styles.versionText}>Tasks v.{Application.nativeApplicationVersion}</Text>
    </Animated.ScrollView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flex: 1,
    padding: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    maxWidth: '100%',
  },
  headingWrapper: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'baseline',
  },
  divider: {
    borderWidth: 0.5,
    marginBottom: 15,
    marginTop: 5,
  },
  versionText: {
    marginVertical: 10,
    textAlign: 'center',
    color: 'gray',
  }
});
