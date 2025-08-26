import TaskElement from '@/components/TaskElement';
import { clearDB, fetchAllTasksFromDb } from '@/db';
import { MAIN_BG, MAX_TASK_LENGTH } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import { useTasks } from '@/hooks/useTasks';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as Notifications from 'expo-notifications';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ensureNotificationPermissions, initNotiffications } from '../../notifications';
import { Bool, Task } from '../../types';

initNotiffications();
ensureNotificationPermissions();

const today = new Date(Date.now());
const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "long",
  day: "numeric",
}

export default function Index() {
  const [addTaskMode, setAddTaskMode] = useState<boolean>(false);
  const [taskValue, setTaskValue] = useState<string>('');
  const newTaskRef = useRef(null);
  const db = useSQLiteContext();
  const { tasks, addTask, setTasks, fetchTodaysTasks, deleteExpiredTasks } = useTasks();
  const { setOpenDropdownId } = useGeneral();
  const [allNotifs, setAllNotifs] = useState<Notifications.NotificationRequest[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchTodaysTasks(db);
    } catch (error) {
      Alert.alert(`Error during refresh: ${String(error)}`);
    } finally {
      setRefreshing(false);
    }
  }, [db, fetchTodaysTasks]);

  function onPress() {
    setAddTaskMode(true);
  }

  async function onSubmit() {
    if (taskValue) {
      const date = Date.now();
      const newTask: Task = { id: date, text: taskValue, created: date, assignedDate: date, isDone: Bool.FALSE };
      addTask(db, newTask);
      setAddTaskMode(false);
      setTaskValue('');
    }
  }

  function onCancel() {
    setAddTaskMode(false);
    setTaskValue('');
  }

  async function getAllNotifs() {
    try {
      const notifs: Notifications.NotificationRequest[] = await Notifications.getAllScheduledNotificationsAsync();
      setAllNotifs(notifs);
    } catch (error) {
      Alert.alert(String(error));
    }
  }

  async function resetData() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setTasks([]);
      clearDB(db);
      Alert.alert('db reset');
    } catch (error) {
      Alert.alert(String(error));
    }
  }

  async function fetchAllTasks() {
    try {
      const res = await fetchAllTasksFromDb(db);
      setAllTasks(res);
    } catch (error) {
      Alert.alert(String(error));
    }
  }

  useEffect(() => {
    deleteExpiredTasks(db);
    fetchTodaysTasks(db);
    fetchAllTasks();
  }, [db]);

  useEffect(() => {
    getAllNotifs();
  }, [tasks]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <Pressable style={[StyleSheet.absoluteFillObject, styles.overlay]} onPress={() => setOpenDropdownId(0)} />
      <View>
        <Text style={styles.todayText}>{today.toLocaleDateString('en-US', dateOptions)}</Text>
        <View style={styles.tasksContainer}>
          {tasks.length > 0
            ? tasks.map(t => (
              <TaskElement key={t.id} task={t} />
            ))
            : <Text>No tasks for today</Text>
          }

          {addTaskMode && (
            <View style={styles.taskInputWrapper}>
              <TextInput
                style={styles.taskInput}
                ref={newTaskRef}
                onChangeText={setTaskValue}
                value={taskValue}
                maxLength={MAX_TASK_LENGTH}
                placeholder="Enter new task..."
              />
              <TouchableOpacity
                style={styles.saveTaskBtn}
                onPress={onSubmit}
              >
                <Text>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelTaskBtn}
                onPress={onCancel}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={onPress}
        >
          <AntDesign style={styles.createBtnIcon} name="plus" size={28} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearBtn}
          onPress={resetData}
        >
          <Text>Clear DB</Text>
        </TouchableOpacity>
      </View>

      {allNotifs.length > 0 ? (
        <View>
          {allNotifs.map(n => (
            <Text key={n.identifier}>{n.identifier}</Text>
          ))}
        </View>
      ) : (
        <Text>No scheduled notifications</Text>
      )}

      <View>
        {allTasks.map(item => (
          <Text key={item.id}>{item.assignedDate} - {item.text}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: MAIN_BG,
    gap: 6,
    padding: 5,
    minHeight: '100%',
    paddingTop: 25,
    borderWidth: 1,
    borderColor: 'blue',
  },
  headerPadding: {
    height: 40,
    backgroundColor: 'gray',
  },
  createBtn: {
    borderRadius: '50%',
    position: 'fixed',
    // bottom: '0%',
    // right: '5%',
    top: '160%',
    right: '-80%',
    backgroundColor: 'royalblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
  },
  createBtnIcon: {
    color: 'white',
  },
  taskInputWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
  },
  taskInput: {
    backgroundColor: 'white',
    borderColor: 'green',
    borderWidth: 1,
    padding: 2,
  },
  saveTaskBtn: {
    backgroundColor: 'green',
    color: 'white',
    padding: 2,
  },
  cancelTaskBtn: {
    backgroundColor: 'red',
    color: 'white',
    padding: 2,
  },
  todayText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  clearBtn: {
    padding: 4,
    backgroundColor: 'red',
    color: 'white',
    marginHorizontal: 'auto',
    marginTop: 8
  },
  overlay: {
    borderWidth: 1,
    borderColor: 'red',
    minHeight: '100%',
  },
  tasksContainer: {
    gap: 5,
  }
})
