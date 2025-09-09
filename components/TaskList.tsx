import { clearDB } from '@/db'
import { MAIN_BG } from '@/globals'
import { useGeneral } from '@/hooks/useGeneral'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/types'
import AntDesign from '@expo/vector-icons/AntDesign'
import * as Notifications from 'expo-notifications'
import * as SQLite from 'expo-sqlite'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import NewTaskModalContent from './NewTaskModalContent'
import TaskElement from './TaskElement'
import TaskSkeleton from './TaskSkeleton'

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "long",
  day: "numeric",
}

const taskSkeletonsAmount = 5;

export default function TaskList({ targetDate }: { targetDate: Date }) {
  const [addTaskMode, setAddTaskMode] = useState<boolean>(false);
  const db = SQLite.useSQLiteContext();
  const { tasks, isLoading, setTasks, fetchAllTasks, deleteExpiredTasks } = useTasks();
  const { setOpenDropdownId } = useGeneral();
  const [allNotifs, setAllNotifs] = useState<Notifications.NotificationRequest[]>([]);
  const [targetDateTasks, setTargetDateTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchTasksForDay = useCallback((targetDate: Date) => {
    if (tasks.length > 0) {
      let startMidnight = new Date(targetDate);
      startMidnight.setHours(0, 0, 0, 0);
      let endMidnight = new Date(targetDate);
      endMidnight.setHours(24, 0, 0, 0);
      const filteredTasks = tasks
        .filter(t => t.assignedDate >= startMidnight.getTime() && t.assignedDate < endMidnight.getTime())
        .sort((a,b) => a.isDone - b.isDone);
      setTargetDateTasks(filteredTasks);
    }
  }, [tasks]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllTasks(db);
    fetchTasksForDay(targetDate);
    setOpenDropdownId(0)
    setRefreshing(false);
  }, [db, fetchTasksForDay, targetDate]);

  function onPress() {
    setAddTaskMode(true);
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

  useEffect(() => {
    async function updateData() {
      await deleteExpiredTasks(db);
      await fetchAllTasks(db);
    }
    updateData();
  }, [db]);

  useEffect(() => {
    fetchTasksForDay(targetDate);
  }, [targetDate, tasks]);

  useEffect(() => {
    getAllNotifs();
  }, [tasks]);

  return (
    <GestureHandlerRootView>
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
          <Text style={styles.todayText}>{targetDate.toLocaleDateString('en-US', dateOptions)}</Text>
          <View style={styles.tasksContainer}>
            {isLoading
              ? Array.from({length: taskSkeletonsAmount}).map((_, i) => <TaskSkeleton key={i} />)
              : targetDateTasks.length > 0
                ? targetDateTasks.map((t, i) => (
                  <TaskElement key={t.id} task={t} pos={i+1} />
                ))
                : <Text>No tasks for this day</Text>
            }
          </View>

        </View>
        <NewTaskModalContent db={db} addTaskMode={addTaskMode} setAddTaskMode={setAddTaskMode} assignedDate={targetDate.getTime()} />

        <TouchableOpacity
          style={styles.clearBtn}
          onPress={resetData}
        >
          <Text>Clear DB</Text>
        </TouchableOpacity>

        {allNotifs.length > 0 ? (
          <View>
            {allNotifs.map(n => (
              <Text key={n.identifier}>{n.identifier}</Text>
            ))}
          </View>
        ) : (
          <Text>No scheduled notifications</Text>
        )}

        {/* <View>
          <Text>All Tasks:</Text>
          {tasks.map(item => (
            <Text key={item.id}>{new Date(item.assignedDate).toLocaleDateString('en-US', dateOptions)} - {item.text}</Text>
          ))}
        </View> */}
      </ScrollView>
      <TouchableOpacity
        style={styles.createBtn}
        onPress={onPress}
      >
        <AntDesign style={styles.createBtnIcon} name="plus" size={28} />
      </TouchableOpacity>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: MAIN_BG,
    gap: 6,
    padding: 5,
    minHeight: '100%',
    paddingTop: 25,
    // borderWidth: 1,
    // borderColor: 'blue',
  },
  headerPadding: {
    height: 40,
    backgroundColor: 'gray',
  },
  createBtn: {
    borderRadius: '50%',
    position: 'absolute',
    // bottom: '0%',
    // right: '5%',
    right: '4%',
    bottom: '4%',
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
  },
})
