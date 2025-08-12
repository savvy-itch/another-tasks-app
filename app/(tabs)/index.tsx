import TaskElement from '@/components/TaskElement';
import { addTaskToDb, fetchTodaysTasks } from '@/db';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ensureNotificationPermissions, initNotiffications } from '../../notifications';
import { Task } from '../../types';

initNotiffications();
ensureNotificationPermissions();

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addTask, setAddTask] = useState<boolean>(false);
  const [taskValue, setTaskValue] = useState<string>('');
  const newTaskRef = useRef(null);
  const db = useSQLiteContext();

  function onPress() {
    setAddTask(true);
  }

  async function onSubmit() {
    const date = Date.now();
    const newTask: Task = { id: date, text: taskValue, created: date, assignedDate: date, isDone: false };
    await addTaskToDb(db, newTask);
    setTasks(prev => [...prev, newTask]);
    setAddTask(false);
    setTaskValue('');
  }

  function onCancel() {
    setAddTask(false);
    setTaskValue('');
  }

  useEffect(() => {
    async function setup() {
      const result = await fetchTodaysTasks(db);
      if (result) {
        setTasks(result);
      }
    }
    setup();
  }, [db]);

  return (
    <ScrollView style={styles.container}>
      {tasks.length > 0
        ? tasks.map(t => (
          <TaskElement key={t.id} task={t} />
        ))
        : <Text>No tasks for today</Text>
      }

      {addTask && (
        <View style={styles.taskInputWrapper}>
          <TextInput
            style={styles.taskInput}
            ref={newTaskRef}
            onChangeText={setTaskValue}
            value={taskValue}
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

      <TouchableOpacity
        style={styles.createBtn}
        onPress={onPress}
      >
        <Text style={styles.createBtnText}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'darkgray',
    borderColor: 'red',
    borderWidth: 1,
    gap: 2,
  },
  createBtn: {
    borderRadius: 4,
    padding: 5,
    position: 'absolute',
    top: '90%',
    right: '5%',
    backgroundColor: 'blue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createBtnText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  }
})
