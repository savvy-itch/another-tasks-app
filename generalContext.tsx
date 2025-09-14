import Storage from 'expo-sqlite/kv-store';
import { createContext, useState } from "react";
import { Alert } from 'react-native';
import { setFontSizePrefInStorage } from "./db";
import { GeneralContextType } from "./types";

export const GeneralContext = createContext<GeneralContextType | null>(null);

interface GeneralProviderProps {
  children: React.ReactNode;
}

export default function GeneralProvider({ children }: GeneralProviderProps) {
  const [openDropdownId, setOpenDropdownId] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(1);

  async function fetchAppPrefs() {
    const fontSizePref = await Storage.getItem('fontSize');
    if (fontSizePref) {
      const fontSizeNum = JSON.parse(fontSizePref).fontSize;
      setFontSize(isNaN(fontSizeNum) ? 1 : fontSizeNum);
    } else {
      setFontSize(1);
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

  return (
    <GeneralContext.Provider value={{
      openDropdownId, 
      setOpenDropdownId, 
      fontSize,
      setFontSizePref,
      fetchAppPrefs,
    }}>
      {children}
    </GeneralContext.Provider>
  )
}
