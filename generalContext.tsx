import Storage from 'expo-sqlite/kv-store';
import { createContext, useState } from "react";
import { Alert, Appearance } from 'react-native';
import { setFontSizePrefInStorage, setThemePrefInStorage } from "./db";
import { GeneralContextType, themes } from "./types";

export const GeneralContext = createContext<GeneralContextType | null>(null);

interface GeneralProviderProps {
  children: React.ReactNode;
}

export default function GeneralProvider({ children }: GeneralProviderProps) {
  const [openDropdownId, setOpenDropdownId] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(1);
  const [curTheme, setCurTheme] = useState<themes>("light");

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

  return (
    <GeneralContext.Provider value={{
      openDropdownId, 
      setOpenDropdownId, 
      fontSize,
      curTheme,
      setFontSizePref,
      fetchAppPrefs,
      setThemePref,
    }}>
      {children}
    </GeneralContext.Provider>
  )
}
