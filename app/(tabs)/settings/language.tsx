import { allThemes, BASE_FONT_SIZE } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import { translations } from '@/i18n/i18n';
import { Languages } from '@/types';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const INDICATOR_SIZE = 17;

export default function Language() {
  const { language, curTheme, fontSize, setLangPref } = useGeneral();

  return (
    <View style={[styles.mainContainer, { backgroundColor: allThemes[curTheme].mainBg }]}>
      {Object.keys(translations).map(lang => {
        const langKey = lang as Languages;
        return (
          <Pressable
            key={langKey}
            style={[styles.radio, { borderColor: allThemes[curTheme].textColor }]}
            onPress={() => setLangPref(langKey)}
          >
            <View style={[styles.radioIndicator, { borderColor: allThemes[curTheme].textColor }]}>
              {/* wrapper is needed to guarantee border radius when radio is toggled */}
              <View style={{ borderRadius: (INDICATOR_SIZE * 0.4) / 2, overflow: 'hidden' }}>
                <View style={[styles.indicatorCore, language === lang && { backgroundColor: allThemes[curTheme].textColor }]} />
              </View>
            </View>
            <Text style={{ fontSize: BASE_FONT_SIZE * fontSize, color: allThemes[curTheme].textColor }}>{translations[langKey].langName}</Text>
          </Pressable>
        )
      }
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flex: 1,
    padding: 20,
  },
  radio: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 12,
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
