import { useGeneral } from '@/hooks/useGeneral';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ReactNode, useEffect, useState } from 'react';
 
export default function StartupGate({ children }: { children:ReactNode }) {
  const [isPrefLoading, setIsPrefLoading] = useState<boolean>(true);
  const { fetchAppPrefs } = useGeneral();
  const [fontsLoaded, error] = useFonts({
    overlock: require("../assets/fonts/overlock_regular.ttf"),
    sourgummy: require("../assets/fonts/SourGummy-Regular.ttf"),
    nunito: require("../assets/fonts/Nunito-Regular.ttf"),
  });

  useEffect(() => {
    if ((fontsLoaded || error) && !isPrefLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error, isPrefLoading]);

  useEffect(() => {
    async function fetchPrefs() {
      setIsPrefLoading(true);
      await fetchAppPrefs();
      setIsPrefLoading(false);
    }
    fetchPrefs();
  }, [fetchAppPrefs]);

  if (!fontsLoaded || isPrefLoading) {
    return null;
  }

  return children
}
