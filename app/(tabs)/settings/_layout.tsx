import { allThemes } from "@/globals";
import { useGeneral } from "@/hooks/useGeneral";
import i18n from "@/i18n/i18n";
import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: 'index',
}

export default function SettingsLayout() {
  const { curTheme } = useGeneral();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ title: i18n.t("settings") }}
      />
      <Stack.Screen
        name="language"
        options={{ 
          headerShown: true, 
          title: i18n.t("settingsTab.selectLanguage"), 
          headerStyle: { backgroundColor: allThemes[curTheme].mainBg },
          headerTintColor: allThemes[curTheme].textColor,
        }}
      />
    </Stack>
  )
}
