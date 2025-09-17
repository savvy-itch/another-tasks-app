import GeneralProvider from "@/context/generalContext";
import TasksProvider from "@/context/tasksContext";
import { migrateDb } from "@/db";
import { Stack } from "expo-router";
import { SQLiteProvider } from 'expo-sqlite';
import { StyleSheet, View } from "react-native";

export default function RootLayout() {

  return (
    <SQLiteProvider databaseName="tasks.db" onInit={migrateDb}>
      <View style={styles.headerPadding} />
      <TasksProvider>
        <GeneralProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
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
