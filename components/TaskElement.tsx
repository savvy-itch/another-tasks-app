import { MAX_TASK_LENGTH } from '@/globals';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types';
import { padNumber } from '@/utils';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TimePicker from './TimePicker';

export default function TaskElement({ task }: { task: Task }) {
  const db = useSQLiteContext();
  const { deleteTask, toggleStatus, editText, deleteNotif } = useTasks();
  const [editTaskMode, setEditTaskMode] = useState<boolean>(false);
  const [taskValue, setTaskValue] = useState<string>(task.text);
  const [invalidInput, setInvalidInput] = useState<boolean>(false);
  const [notifModalVisible, setNotifModalVisible] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null);

  async function submitTextEdit() {
    if (taskValue) {
      editText(db, task.id, taskValue);
      setEditTaskMode(false);
      setTaskValue(taskValue);
      setInvalidInput(false);
    } else {
      setInvalidInput(true);
    }
  }

  function exitEditMode() {
    setEditTaskMode(false);
    setInvalidInput(false);
  }

  function handleInputChange(text: string) {
    setTaskValue(text);
    if (invalidInput) {
      setInvalidInput(false);
    }
  }

  async function cancelNotif() {
    if (task.notifId) {
      deleteNotif(db, task.id, task.notifId);
    }
  }

  useEffect(() => {
    if (editTaskMode) {
      inputRef.current?.focus();
    }
  }, [editTaskMode]);

  return (
    <View style={[styles.taskWrapper, invalidInput && styles.errorBorder]} key={task.id}>
      {editTaskMode ? (
        <>
          <TextInput
            ref={inputRef}
            style={styles.taskInput}
            value={taskValue}
            maxLength={MAX_TASK_LENGTH}
            onChangeText={text => handleInputChange(text)}
            multiline
          />
          <View style={styles.taskBtnWrapper}>
            <TouchableOpacity
              onPress={submitTextEdit}
            >
              <Ionicons name="checkmark" size={26} color="green" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={exitEditMode}
            >
              <Entypo name="cross" size={26} color="red" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Pressable style={styles.pressable} onPress={() => toggleStatus(db, task.id)}>
            <Text
              style={task.isDone ? styles.taskDone : styles.taskText}
              textBreakStrategy='simple'
            >
              {task.text}
            </Text>
            <Text style={styles.devText}>notifId: {task.notifId}</Text>
            <Text style={styles.devText}>notifDate: {(task.notifDate)}</Text>
            <Text style={styles.devText}>isDone: {task.isDone ? 'done' : 'not done'}</Text>
          </Pressable>
          <View style={styles.taskBtnWrapper}>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
                <MaterialCommunityIcons name="dots-horizontal" size={30} color="black" />
              </TouchableOpacity>
              {showDropdown && (
                <View style={styles.dropdown}>
                  <TouchableOpacity
                    style={[styles.notifBtn, styles.dropdownOption]}
                    onPress={() => setEditTaskMode(true)}
                    disabled={task.isDone ? true : false}
                  >
                    <Entypo name="edit" size={26} color="black" />
                    <Text>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.notifBtn, styles.dropdownOption]}
                    onPress={() => setNotifModalVisible(true)}
                    disabled={task.isDone ? true : false}
                  >
                    <AntDesign name="bells" size={26} color="black" />
                    <Text>Notification</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.dropdownOption]}
                    onPress={() => deleteTask(db, task.id)}
                  >
                    <AntDesign name="delete" size={26} color="black" />
                    <Text>Delete</Text>
                  </TouchableOpacity>
                  {task.notifId && !task.isDone && (typeof (task.notifDate) === 'number') && task.notifDate > Date.now() && (
                    <TouchableOpacity
                      style={styles.dropdownOption}
                      onPress={cancelNotif}
                    >
                      <Feather name="bell-off" size={26} color="black" />
                      <Text>Delete notification</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
          <TimePicker notifModalVisible={notifModalVisible} setNotifModalVisible={setNotifModalVisible} task={task} db={db} />
          {(typeof (task.notifDate) === 'number' && !task.isDone && task.notifDate > Date.now()) && (
            <Text>{padNumber(new Date(task.notifDate).getHours())}:{padNumber(new Date(task.notifDate).getMinutes())}</Text>
          )}
        </>
      )
      }
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
    gap: 4,

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
    maxWidth: '100%',
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
    flexShrink: 1,
    width: '100%',
    padding: 2,
  },
  taskInput: {
    fontSize: 20,
    flexShrink: 1,
    width: '100%',
    borderColor: 'blue',
    borderWidth: 1,
    padding: 2
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorMsg: {
    color: 'red',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  devText: {
    fontSize: 12,
    color: 'gray',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdown: {
    padding: 4,
    backgroundColor: 'hsla(0, 0%, 90%, 1.00)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'dimgray',
    position: 'absolute',
    right: 0,
    top: '50%',
    zIndex: 10,
    minWidth: 200,
  },
  dropdownOption: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  lastDropdownOption: {
    borderBottomWidth: 0
  }
});
