import { useGeneral } from '@/hooks/useGeneral';
import { useTasks } from '@/hooks/useTasks';
import { useTranslation } from '@/hooks/useTranslation';
import { ensureNotificationPermissions } from '@/notifications';
import { Task } from '@/types';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { SQLiteDatabase } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

interface ModalProps {
  notifModalVisible: boolean,
  setNotifModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  task: Task,
  db: SQLiteDatabase
}

export default function TimePicker({ notifModalVisible, setNotifModalVisible, task, db }: ModalProps) {
  const [date, setDate] = useState<Date>(new Date(Date.now()));
  const { setNotifTime } = useTasks();
  const { setOpenDropdownId } = useGeneral();
  const i18n = useTranslation();

  async function onChange(e: DateTimePickerEvent, selectedDate?: Date) {
    try {
      if (e.type === 'set') {
        if (selectedDate) {
          // if the new date is not in the past
          if (selectedDate.getTime() > Date.now()) {
            selectedDate.setSeconds(0);
            setDate(selectedDate);

            // cancel old notification
            if (task.notifId) {
              await Notifications.cancelScheduledNotificationAsync(task.notifId);
            }

            if ((await ensureNotificationPermissions()) || !task.isDone) {
              const notifId: string = await setNotification(task.text, selectedDate);
              setNotifTime(db, task.id, selectedDate.getTime(), notifId);
            }
          }
        }
      }
      setNotifModalVisible(false);
      setOpenDropdownId(0);
    } catch (error) {
      Alert.alert(String(error));
    }
  }

  async function setNotification(body: string, notifDate: Date): Promise<string> {
    return Notifications.scheduleNotificationAsync({
      content: {
        title: `${notifDate.getHours()}:${notifDate.getMinutes()} ${i18n.t("task.reminder")}!`,
        body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notifDate,
      },
    });
  }

  useEffect(() => {
    if (notifModalVisible) {
      setDate(new Date(Date.now()));
    }
  }, [notifModalVisible]);

  return (
    <>
      {notifModalVisible && (
        <DateTimePicker
          value={date}
          mode='time'
          is24Hour={true}
          display='spinner'
          onChange={onChange}
          style={styles.timePicker}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  timePicker: {
    borderRadius: 10,
    padding: 35,
    width: '70%',
    minHeight: '50%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#222831',
    borderRadius: 10,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '70%',
    minHeight: '50%',
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    color: 'white',
  },
  modalBtn: {
    backgroundColor: '#393E46',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  }
});
