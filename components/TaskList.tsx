import { migrateDb } from '@/db'
import { allThemes, BASE_FONT_SIZE } from '@/globals'
import { useGeneral } from '@/hooks/useGeneral'
import { useTasks } from '@/hooks/useTasks'
import i18n from '@/i18n/i18n'
import { Languages, Task } from '@/types'
import AntDesign from '@expo/vector-icons/AntDesign'
import * as Notifications from 'expo-notifications'
import * as SQLite from 'expo-sqlite'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import DeleteAllTasksModal from './DeleteAllTasksModal'
import NewTaskModalContent from './NewTaskModalContent'
import TaskElement from './TaskElement'
import TaskSkeleton from './TaskSkeleton'

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "long",
  day: "numeric",
}

const taskSkeletonsAmount = 5;

function capitalizeDateStr(s: string, lang: Languages) {
  if (lang === 'en') return s; // English dates are capitalized by default
  let capitalizedStr = s.charAt(0).toUpperCase();
  for (let i = 1; i < s.length; i++) {
    if (s[i] === ',') {
      capitalizedStr += s.substring(i, i + 5) + s.charAt(i + 5).toUpperCase() + s.substring(i + 6);
      break;
    }
    capitalizedStr += s[i];
  }
  return capitalizedStr;
}

function compareTasks(a: Task, b: Task): number {
  return getRank(a) - getRank(b);
}

function getRank(t: Task): number {
  if (t.isDone) return 2;
  if (t.priority === "Important") return -1;
  if (t.priority === "General") return 1;
  return 0;
}

export default function TaskList({ targetDate }: { targetDate: Date }) {
  const [addTaskMode, setAddTaskMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDeleteAllTasksModal, setShowDeleteAllTasksModal] = useState<boolean>(false);
  const db = SQLite.useSQLiteContext();
  const { tasks, fetchAllTasks, deleteExpiredTasks } = useTasks();
  const { fontSize, curTheme, language, fetchAppPrefs, setOpenDropdownId } = useGeneral();
  const [allNotifs, setAllNotifs] = useState<Notifications.NotificationRequest[]>([]);
  const [targetDateTasks, setTargetDateTasks] = useState<Task[] | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchTasksForDay = useCallback((targetDate: Date) => {
    if (tasks.length > 0) {
      let startMidnight = new Date(targetDate);
      startMidnight.setHours(0, 0, 0, 0);
      let endMidnight = new Date(targetDate);
      endMidnight.setHours(24, 0, 0, 0);
      const filteredTasks = tasks
        .filter(t => t.assignedDate >= startMidnight.getTime() && t.assignedDate < endMidnight.getTime())
        .sort((a, b) => compareTasks(a, b));
      setTargetDateTasks(filteredTasks);
    } else {
      setTargetDateTasks([]);
    }
  }, [tasks]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllTasks(db);
    setOpenDropdownId(0)
    setRefreshing(false);
  }, [db, fetchAllTasks, setOpenDropdownId]);

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

  useEffect(() => {
    fetchAppPrefs();
  }, [fetchAppPrefs]);

  useEffect(() => {
    fetchTasksForDay(targetDate);
  }, [targetDate, tasks, fetchTasksForDay]);

  useEffect(() => {
    async function updateData() {
      setIsLoading(true);
      await migrateDb(db);
      await deleteExpiredTasks(db);
      await fetchAllTasks(db);
      setIsLoading(false);
    }
    updateData();
  }, [db]);

  useEffect(() => {
    getAllNotifs();
  }, [tasks]);

  return (
    <GestureHandlerRootView>
      <ScrollView
        style={[styles.container, { backgroundColor: allThemes[curTheme].mainBg }]}
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 }}>
            <Text style={[styles.todayText, { fontSize: 20 * fontSize, color: allThemes[curTheme].textColor }]}>
              {capitalizeDateStr(targetDate.toLocaleDateString(language, dateOptions), language)}
            </Text>
            <Pressable
              style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}
              onPress={() => setShowDeleteAllTasksModal(true)}
            >
              <AntDesign name="delete" size={26} color={allThemes[curTheme].textColor} />
            </Pressable>
            <DeleteAllTasksModal db={db} showDeleteAllTasksModal={showDeleteAllTasksModal} setShowDeleteAllTasksModal={setShowDeleteAllTasksModal} targetDate={targetDate} />
          </View>

          <View style={styles.tasksContainer}>
            {!targetDateTasks
              ? Array.from({ length: taskSkeletonsAmount }).map((_, i) => <TaskSkeleton key={i} />)
              : targetDateTasks.length > 0
                ? targetDateTasks.map((t, i) => (
                  <TaskElement key={t.id} task={t} pos={i + 1} db={db} />
                ))
                : <Text style={{ fontSize: fontSize * BASE_FONT_SIZE, color: allThemes[curTheme].textColor, textAlign: 'center', marginTop: 50 }}>
                  {i18n.t("noTasks")}
                </Text>
            }
          </View>

        </View>
        <NewTaskModalContent db={db} addTaskMode={addTaskMode} setAddTaskMode={setAddTaskMode} assignedDate={targetDate.getTime()} />

        {/* {allNotifs.length > 0 ? (
          <View>
            {allNotifs.map(n => (
              <Text key={n.identifier}>{n.identifier}</Text>
            ))}
          </View>
        ) : (
          <Text>No scheduled notifications</Text>
        )} */}

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
    gap: 6,
    padding: 5,
    minHeight: '100%',
    paddingTop: 25,
  },
  headerPadding: {
    height: 40,
    backgroundColor: 'gray',
  },
  createBtn: {
    borderRadius: '50%',
    position: 'absolute',
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
    minHeight: '100%',
  },
  tasksContainer: {
    gap: 5,
  },
})
