import ClearDataModal from '@/components/ClearDataModal';
import RadioButton from '@/components/RadioButton';
import ThemeRadioButton from '@/components/ThemeRadioButton';
import { allThemes, BASE_FONT_SIZE } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import { useTranslation } from '@/hooks/useTranslation';
import { translations } from '@/i18n/i18n';
import { themes } from '@/types';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Application from 'expo-application';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

const fontSizeCoef = {
  normal: 1,
  big: 1.2,
}

export default function Settings() {
  const [showClearDataModal, setShowClearDataModal] = useState<boolean>(false);
  const { fontSize, curTheme, language, fetchAppPrefs } = useGeneral();
  const i18n = useTranslation();

  useEffect(() => {
    fetchAppPrefs()
  }, [fetchAppPrefs]);

  return (
    <Animated.ScrollView contentContainerStyle={[styles.mainContainer, { backgroundColor: allThemes[curTheme].mainBg, paddingTop: 50 }]}>
      <View style={styles.headingWrapper}>
        <FontAwesome name="text-height" size={BASE_FONT_SIZE} color={allThemes[curTheme].textColor} />
        <Text style={{ fontSize: BASE_FONT_SIZE * fontSize, color: allThemes[curTheme].textColor }}>{i18n.t("settingsTab.fontSize")}</Text>
      </View>
      <View style={styles.radioContainer}>
        <RadioButton text={i18n.t("settingsTab.normal")} val={fontSizeCoef.normal} />
        <RadioButton text={i18n.t("settingsTab.large")} val={fontSizeCoef.big} />
      </View>

      <View style={[styles.divider, { borderColor: allThemes[curTheme].textColor, opacity: 0.5 }]} />

      <View style={styles.headingWrapper}>
        <Ionicons name="color-palette" size={BASE_FONT_SIZE} color={allThemes[curTheme].textColor} />
        <Text style={{ fontSize: BASE_FONT_SIZE * fontSize, color: allThemes[curTheme].textColor }}>{i18n.t("settingsTab.theme")}</Text>
      </View>
      <View style={styles.radioContainer}>
        {Object.keys(allThemes).map((t) => <ThemeRadioButton key={t} val={t as themes} />)}
      </View>

      <View style={[styles.divider, { borderColor: allThemes[curTheme].textColor, opacity: 0.5 }]} />

      <Link
        href="/settings/language" asChild
        style={[styles.headingWrapper, styles.inlineContainer]}
      >
        <Pressable style={styles.inlineOption}>
          <View style={styles.headingWrapper}>
            <Ionicons name="language" size={BASE_FONT_SIZE} color={allThemes[curTheme].textColor} />
            <Text style={{ fontSize: BASE_FONT_SIZE * fontSize, color: allThemes[curTheme].textColor }}>{i18n.t("settingsTab.language")}</Text>
          </View>
          <Text style={{ fontSize: 15 * fontSize, color: allThemes[curTheme].textColor, opacity: 0.5 }}>{translations[language].langName}</Text>
        </Pressable>
      </Link>

      <View style={[styles.divider, { borderColor: allThemes[curTheme].textColor, opacity: 0.5 }]} />

      <Pressable 
        style={[styles.inlineOption, styles.inlineContainer]}
        onPress={() => setShowClearDataModal(true)}
      >
        <View style={styles.headingWrapper}>
          <FontAwesome name="warning" size={BASE_FONT_SIZE} color={allThemes[curTheme].textColor} />
          <Text style={{ fontSize: BASE_FONT_SIZE * fontSize, color: allThemes[curTheme].textColor }}>
            {i18n.t("settingsTab.clearData")}
          </Text>
        </View>
      </Pressable>
      <ClearDataModal showClearDataModal={showClearDataModal} setShowClearDataModal={setShowClearDataModal} />

      <View style={[styles.divider, { borderColor: allThemes[curTheme].textColor, opacity: 0.5 }]} />

      <View style={[styles.headingWrapper, styles.inlineContainer, styles.inlineOption, {marginBottom: 20}]}>
        <View style={styles.headingWrapper}>
          <Feather name="info" size={BASE_FONT_SIZE} color={allThemes[curTheme].textColor} />
          <Text style={{ fontSize: BASE_FONT_SIZE * fontSize, color: allThemes[curTheme].textColor }}>{i18n.t("settingsTab.appVersion")}</Text>
        </View>
        <Text style={{ fontSize: 15 * fontSize, color: allThemes[curTheme].textColor, opacity: 0.5 }}>v.{Application.nativeApplicationVersion}</Text>
      </View>
    </Animated.ScrollView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flex: 1,
    padding: 20,
    paddingBottom: 50,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    maxWidth: '100%',
  },
  inlineContainer: {
    paddingBottom: 15,
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
  },
  inlineOption: {
    justifyContent: 'space-between',
  },
});
