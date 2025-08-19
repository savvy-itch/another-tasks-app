import TaskElement from '@/components/TaskElement';
import { MAX_TASK_LENGTH } from '@/globals';
import { useTasks } from '@/hooks/useTasks';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
  const { tasks, addTask, fetchTodaysTasks } = useTasks();

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

  useEffect(() => {
    fetchTodaysTasks(db);
  }, [db]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.todayText}>{today.toLocaleDateString('en-US', dateOptions)}</Text>
      <View>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FBF3D5',
    gap: 6,
    padding: 5,
    minHeight: 100,
    position: 'relative',
    paddingTop: 30
  },
  headerPadding: {
    height: 40,
    backgroundColor: 'gray',
  },
  createBtn: {
    borderRadius: '50%',
    position: 'fixed',
    bottom: '15%',
    right: '5%',
    // right: '-80%',
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
  }
})
