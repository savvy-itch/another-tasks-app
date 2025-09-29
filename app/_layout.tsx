import StartupGate from "@/components/StartupGate";
import GeneralProvider from "@/context/generalContext";
import TasksProvider from "@/context/tasksContext";
import { migrateDb } from "@/db";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { StyleSheet, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  return (
    <SQLiteProvider databaseName="tasks.db" onInit={migrateDb}>
      <View style={styles.headerPadding} />
      <TasksProvider>
        <GeneralProvider>
          <StartupGate>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </StartupGate>
        </GeneralProvider>
      </TasksProvider>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  headerPadding: {
    height: 33,
    backgroundColor: 'hsla(0, 0%, 15%, 1.00)',
    position: 'fixed',
    left: 0,
    right: 0,
  },
});
