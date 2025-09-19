import { allThemes } from "@/globals";
import { useGeneral } from "@/hooks/useGeneral";
import { useTranslation } from "@/hooks/useTranslation";
import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: 'index',
}

export default function SettingsLayout() {
  const { curTheme } = useGeneral();
  const i18n = useTranslation();

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
