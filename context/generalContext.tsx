import { clearPrefsInStorage, setFontSizePrefInStorage, setLangPrefInStorage, setThemePrefInStorage } from '@/db';
import i18n from '@/i18n/i18n';
import { GeneralContextType, Languages, themes } from '@/types';
import { getLocales } from 'expo-localization';
import Storage from 'expo-sqlite/kv-store';
import { createContext, useState } from "react";
import { Alert, Appearance } from 'react-native';

export const GeneralContext = createContext<GeneralContextType | null>(null);

interface GeneralProviderProps {
  children: React.ReactNode;
}

export default function GeneralProvider({ children }: GeneralProviderProps) {
  const [openDropdownId, setOpenDropdownId] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(1);
  const [curTheme, setCurTheme] = useState<themes>("light");
  const [language, setLanguage] = useState<Languages>("en");

  async function fetchAppPrefs() {
    const fontSizePref = await Storage.getItem('fontSize');
    if (fontSizePref) {
      const fontSizeNum = JSON.parse(fontSizePref).fontSize;
      setFontSize(isNaN(fontSizeNum) ? 1 : fontSizeNum);
    } else {
      setFontSize(1);
    }

    const themePref = await Storage.getItem('theme');
    if (themePref) {
      const theme = JSON.parse(themePref).theme;
      setCurTheme(theme);
    } else {
      setCurTheme(Appearance.getColorScheme() ?? "light");
    }

    const langPref = await Storage.getItem('lang');
    if (langPref) {
      const lang = JSON.parse(langPref).lang;
      i18n.locale = lang;
      setLanguage(lang);
    } else {
      const langSys = getLocales()[0].languageCode ?? "en";
      i18n.locale = langSys;
    }
  }

  async function setFontSizePref(val: number) {
    if (val !== fontSize) {
      try {
        await setFontSizePrefInStorage(val);
        setFontSize(val);
      } catch (error) {
        Alert.alert(String(error));
      }
    }
  }

  async function setThemePref(themePref: themes) {
    if (themePref !== curTheme) {
      try {
        await setThemePrefInStorage(themePref);
        setCurTheme(themePref);
      } catch (error) {
        Alert.alert(String(error));
      }
    }
  }

  async function setLangPref(langPref: Languages) {
    if (langPref !== i18n.locale) {
      try {
        await setLangPrefInStorage(langPref);
        i18n.locale = langPref;
        setLanguage(langPref);
      } catch (error) {
        Alert.alert(String(error));
      }
    }
  }

  async function clearPrefs() {
    try {
      await clearPrefsInStorage();
      setFontSize(1);
      setCurTheme(Appearance.getColorScheme() ?? "light");
      const langSys = getLocales()[0].languageCode as Languages ?? "en";
      i18n.locale = langSys;
      setLanguage(langSys);
    } catch (error) {
      Alert.alert(String(error));
    }
  }

  return (
    <GeneralContext.Provider value={{
      openDropdownId,
      setOpenDropdownId,
      fontSize,
      curTheme,
      language,
      setFontSizePref,
      fetchAppPrefs,
      setThemePref,
      setLangPref,
      clearPrefs
    }}>
      {children}
    </GeneralContext.Provider>
  )
}
