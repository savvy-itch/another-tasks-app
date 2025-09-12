import { MAX_TASK_LENGTH } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types';
import { padNumber } from '@/utils';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import TimePicker from './TimePicker';

const MAX_OFFSET_BEFORE_DELETION = 0.3;

export default function TaskElement({ task, pos }: { task: Task, pos: number }) {
  const db = useSQLiteContext();
  const { deleteTask, toggleStatus, editText, deleteNotif } = useTasks();
  const [editTaskMode, setEditTaskMode] = useState<boolean>(false);
  const [taskValue, setTaskValue] = useState<string>(task.text);
  const [invalidInput, setInvalidInput] = useState<boolean>(false);
  const [notifModalVisible, setNotifModalVisible] = useState<boolean>(false);
  const { openDropdownId, fontSize, setOpenDropdownId } = useGeneral();
  const inputRef = useRef<TextInput>(null);
  const translateX = useSharedValue(0);
  const deleteIconSize = useSharedValue(0);
  const { width } = useWindowDimensions();

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
      Alert.alert(task.notifId);
      deleteNotif(db, task.id, task.notifId);
    }
  }

  function handleStatusToggle() {
    toggleStatus(db, task.id)
    setOpenDropdownId(0);
  }

  function handleOptionsBtnPress() {
    if (openDropdownId === task.id) {
      setOpenDropdownId(0);
    } else {
      setOpenDropdownId(task.id)
    }
  }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }]
    };
  });

  const deleteIconStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(deleteIconSize.value, {
        duration: 300,
      }),
      height: withTiming(deleteIconSize.value, {
        duration: 300,
      }),
    };
  });

  // runOnJS needs closure for db argument
  const handleDeleteFromGesture = useCallback((id: number) => {
    deleteTask(db, id);
  }, [db]);

  const tap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      console.log('tap');
      runOnJS(handleStatusToggle)();
    });

  const swipe = Gesture.Pan()
    .onStart(e => {
      runOnJS(setOpenDropdownId)(0);
    })
    .onChange(e => {
      if (!editTaskMode) {
        // swipe left
        if ((translateX.value + e.changeX) < 0) {
          translateX.value += e.changeX;
          if (translateX.value <= (-width * MAX_OFFSET_BEFORE_DELETION)) {
            deleteIconSize.value = 30;
          }
        } else if ((translateX.value + e.changeX) > translateX.value) {
          // swipe right
          deleteIconSize.value = 0;
        }
      }
    })
    .onEnd(() => {
      if (translateX.value <= (-width * MAX_OFFSET_BEFORE_DELETION)) {
        console.log("Deleting...");
        runOnJS(handleDeleteFromGesture)(task.id);
        translateX.value = withTiming(-width, { duration: 300 });
      } else {
        translateX.value = 0;
      }
      deleteIconSize.value = 0;
    });

  useEffect(() => {
    if (editTaskMode) {
      setOpenDropdownId(0);
      inputRef.current?.focus();
    }
  }, [editTaskMode]);

  return (
    <GestureDetector gesture={swipe}>
      <Animated.View
        style={[styles.taskWrapper, invalidInput && styles.errorBorder, animatedStyles, task.id === openDropdownId && { zIndex: 100 }]}
      >
        {editTaskMode ? (
          <>
            <TextInput
              ref={inputRef}
              style={[styles.taskInput, { fontSize: 20 * fontSize }]}
              value={taskValue}
              maxLength={MAX_TASK_LENGTH}
              onChangeText={text => handleInputChange(text)}
              multiline
            />
            <View style={styles.taskBtnWrapper}>
              <TouchableOpacity
                onPress={submitTextEdit}
              >
                <Ionicons name="checkmark" size={28} color="green" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={exitEditMode}
              >
                <Entypo name="cross" size={28} color="red" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <GestureDetector gesture={tap}>
              <Animated.View style={styles.pressable}>
                <Text
                  style={[...(task.isDone ? [styles.taskDone] : []), { fontSize: 18 * fontSize }]}
                  textBreakStrategy='simple'
                >
                  {pos}. {task.text}
                </Text>
                {/* <Text style={styles.devText}>notifId: {task.notifId}</Text>
                <Text style={styles.devText}>notifDate: {(task.notifDate)}</Text>
                <Text style={styles.devText}>isDone: {task.isDone ? 'done' : 'not done'}</Text> */}

                {(typeof (task.notifDate) === 'number' && !task.isDone && task.notifDate > Date.now()) && (
                  <View style={styles.notifTimeWrapper}>
                    <FontAwesome name="bell" size={16} color="gray" />
                    <Text style={[styles.notifTimeText, { fontSize: 14 * fontSize }]}>{padNumber(new Date(task.notifDate).getHours())}:{padNumber(new Date(task.notifDate).getMinutes())}</Text>
                  </View>
                )}
              </Animated.View>
            </GestureDetector>

            {/* the dropdown */}
            <View style={styles.taskBtnWrapper}>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity onPress={handleOptionsBtnPress}>
                  <MaterialCommunityIcons name="dots-horizontal" size={30} color="gray" />
                </TouchableOpacity>
                {(task.id === openDropdownId) && (
                  <View style={styles.dropdown}>
                    <TouchableOpacity
                      style={[styles.notifBtn, styles.dropdownOption]}
                      onPress={() => setEditTaskMode(true)}
                      disabled={task.isDone ? true : false}
                    >
                      <Entypo name="edit" size={26} color="black" />
                      <Text style={{ fontSize: 14 * fontSize }}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.notifBtn, styles.dropdownOption]}
                      onPress={() => setNotifModalVisible(true)}
                      disabled={task.isDone ? true : false}
                    >
                      <AntDesign name="bells" size={26} color="black" />
                      <Text style={{ fontSize: 14 * fontSize }}>Notification</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.notifBtn, styles.dropdownOption]}
                      onPress={() => deleteTask(db, task.id)}
                    >
                      <AntDesign name="delete" size={26} color="black" />
                      <Text style={{ fontSize: 14 * fontSize }}>Delete</Text>
                    </TouchableOpacity>
                    {!task.isDone && (typeof (task.notifDate) === 'number') && task.notifDate > Date.now() && (
                      <TouchableOpacity
                        style={styles.dropdownOption}
                        onPress={cancelNotif}
                      >
                        <Feather name="bell-off" size={26} color="black" />
                        <Text style={{ fontSize: 14 * fontSize }}>Delete notification</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>

            <Animated.View style={[styles.swipeDeleteLabel, deleteIconStyle]}>
              <AntDesign style={styles.swipeDeleteIcon} name="delete" size={26} color="white" />
            </Animated.View>

            <TimePicker notifModalVisible={notifModalVisible} setNotifModalVisible={setNotifModalVisible} task={task} db={db} />
          </>
        )
        }
      </Animated.View>
    </GestureDetector>
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
    width: '100%',
    minHeight: 'auto',
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  pressable: {
    flexShrink: 1,
    width: '100%',
    paddingHorizontal: 2,
    paddingVertical: 8,
  },
  taskInput: {
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
    zIndex: 100,
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
  },
  notifTimeWrapper: {
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexDirection: 'row',
  },
  notifTimeText: {
    color: 'gray',
  },
  swipeDeleteLabel: {
    backgroundColor: 'red',
    borderRadius: 4,
  },
  swipeDeleteIcon: {
    marginHorizontal: 'auto',
    marginVertical: 0,
  },
});
