import RadioButton from '@/components/RadioButton';
import { BASE_FONT_SIZE, MAIN_BG } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Application from 'expo-application';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const fontSizeCoef = {
  normal: 1,
  big: 1.3,
}

export default function Settings() {
  const { fontSize, fetchAppPrefs } = useGeneral();

  useEffect(() => {
    fetchAppPrefs()
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.mainContainer}>
      <View style={styles.headingWrapper}>
        <FontAwesome name="text-height" size={BASE_FONT_SIZE} color="black" />
        <Text style={{ fontSize: BASE_FONT_SIZE * fontSize }}>Font size</Text>
      </View>
      <View style={styles.radioContainer}>
        <RadioButton text="Normal" val={fontSizeCoef.normal} />
        <RadioButton text="Large" val={fontSizeCoef.big} />
      </View>

      <View style={styles.divider} />

      <View style={styles.headingWrapper}>
        <Ionicons name="color-palette" size={BASE_FONT_SIZE} color="black" />
        <Text style={{ fontSize: BASE_FONT_SIZE * fontSize }}>Theme</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.headingWrapper}>
        <Ionicons name="language" size={BASE_FONT_SIZE} color="black" />
        <Text style={{ fontSize: BASE_FONT_SIZE * fontSize }}>Language</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.headingWrapper}>
        <FontAwesome name="warning" size={BASE_FONT_SIZE} color="black" />
        <Text style={{ fontSize: BASE_FONT_SIZE * fontSize }}>Clear data</Text>
      </View>

      <Text style={styles.versionText}>Tasks v.{Application.nativeApplicationVersion}</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flex: 1,
    padding: 20,
    backgroundColor: MAIN_BG,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  headingWrapper: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'baseline',
  },
  divider: {
    borderWidth: 0.5,
    borderBottomColor: 'black',
    marginBottom: 15,
    marginTop: 5,
  },
  versionText: {
    marginVertical: 10,
    textAlign: 'center',
    color: 'gray',
  }
});
