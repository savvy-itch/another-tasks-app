import { useTasks } from '@/hooks/useTasks';
import { ensureNotificationPermissions } from '@/notifications';
import { Task } from '@/types';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as Notifications from 'expo-notifications';
import { useSQLiteContext } from 'expo-sqlite';
import React from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TaskElement({task}: {task: Task}) {
  const db = useSQLiteContext();
  const { deleteTask, toggleStatus } = useTasks();

  async function setNotification(body: string) {
    if (!(await ensureNotificationPermissions()) || task.isDone) return;
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

  return (
    <View style={styles.taskWrapper} key={task.id}>
      <Pressable style={styles.pressable} onPress={() => toggleStatus(db, task.id)}>
        <Text style={task.isDone ? styles.taskDone : styles.taskText}>{task.text}</Text>
      </Pressable>
      <View style={styles.taskBtnWrapper}>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => setNotification(task.text)}
          disabled={task.isDone}
        >
          <AntDesign name="bells" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteTaskBtn}
          onPress={() => deleteTask(db, task.id)}
        >
          <AntDesign name="delete" size={24} color="black" />
        </TouchableOpacity>
      </View>
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
  taskBtnWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  taskWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#F5CBCB',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  taskText: {
    fontSize: 20,
  },
  taskDone: {
    fontSize: 20,
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  pressable: {
    flexGrow: 1
  }
});
