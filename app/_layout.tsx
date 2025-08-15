import { migrateDb } from "@/db";
import TasksProvider from "@/tasksContext";
import { Stack } from "expo-router";
import { SQLiteProvider } from 'expo-sqlite';
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="tasks.db" onInit={migrateDb}>
      <View style={styles.headerPadding} />
      <TasksProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </TasksProvider>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  headerPadding: {
    height: 33,
    backgroundColor: 'dimgray',
    position: 'fixed',
    left: 0,
    right: 0,
  },
});
