import StartupGate from "@/components/StartupGate";
import GeneralProvider from "@/context/generalContext";
import TasksProvider from "@/context/tasksContext";
import { migrateDb } from "@/db";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  return (
    <SQLiteProvider databaseName="tasks.db" onInit={migrateDb}>
      <StatusBar barStyle={'light-content'} backgroundColor={'hsla(0, 0%, 15%, 1.00)'} />
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
