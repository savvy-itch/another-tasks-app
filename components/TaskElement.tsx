import { deleteTaskFromDb } from '@/db';
import { ensureNotificationPermissions } from '@/notifications';
import { Task } from '@/types';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as Notifications from 'expo-notifications';
import { useSQLiteContext } from 'expo-sqlite';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TaskElement({task}: {task: Task}) {
  const db = useSQLiteContext();

  async function setNotification(body: string) {
    if (!(await ensureNotificationPermissions())) return;
    const date = new Date(Date.now() + 15 * 1000); // in 15 secs from now
    // date.setSeconds(0); // uncomment for prod

    Notifications.scheduleNotificationAsync({
      content: {
        title: "Task reminder!",
        body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date
      },
    });
  }

  async function deleteTask() {
    await deleteTaskFromDb(db, task.id);
  }

  return (
    <View style={styles.taskWrapper} key={task.id}>
      <Text>{task.text}</Text>
      <TouchableOpacity
        style={styles.notifBtn}
        onPress={() => setNotification(task.text)}
      >
        <AntDesign name="bells" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteTaskBtn}
        onPress={deleteTask}
      >
        <AntDesign name="delete" size={24} color="black" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  notifBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: 2,
  },
  deleteTaskBtn: {
    backgroundColor: 'red',
    color: 'white',
    padding: 2,
  },
  taskWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'white',
    borderWidth: 1,
    padding: 2,
  }
});
