import { useGeneral } from '@/hooks/useGeneral';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ReactNode, useEffect, useState } from 'react';
 
export default function StartupGate({ children }: { children:ReactNode }) {
  const [isPrefLoading, setIsPrefLoading] = useState<boolean>(true);
  const { fetchAppPrefs } = useGeneral();
  const [fontsLoaded, error] = useFonts({
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

  return <>{children}</>
}
