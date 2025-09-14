import { MAIN_BG } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import { useTasks } from '@/hooks/useTasks';
import Entypo from '@expo/vector-icons/Entypo';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import TaskList from './TaskList';

const weekdays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const totalSlots = 35;
const trueToday = new Date();
const dayBtnSize = 34;

export default function CustomDatePicker() {
  const [curDate, setCurDate] = useState<Date>(new Date());
  const [monthSlots, setMonthSlots] = useState<number[]>([]);
  const [daysWithTasks, setDaysWithTasks] = useState<Set<string>>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [targetDate, setTargetDate] = useState<Date>(trueToday);
  const [isPopulating, setIsPopulating] = useState<boolean>(false);
  const { tasks, isLoading } = useTasks();
  const { fontSize, fetchAppPrefs } = useGeneral();
  const db = useSQLiteContext();

  function updateDaysWithTasks() {
    const filteredTasks: Set<string> = new Set();
    tasks.forEach(t => {
      const d = new Date(t.assignedDate);
      if (d.getMonth() === curDate.getMonth() && d.getFullYear() === curDate.getFullYear()) {
        filteredTasks.add(`${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`);
      }
    });
    setDaysWithTasks(filteredTasks);
  }

  // allow previous months as far back as 1 month before the current one (true current)
  function getPrevMonth() {
    const prev = new Date(curDate.getFullYear(), curDate.getMonth() - 1);
    if (curDate.getFullYear() > trueToday.getFullYear() || (prev.getMonth() + 1) >= trueToday.getMonth()) {
      setCurDate(prev);
    }
  }

  function getNextMonth() {
    const next = new Date(curDate.getFullYear(), curDate.getMonth() + 1);
    setCurDate(next);
  }

  function populateMonthSlots() {
    const arr: number[] = [];
    const dayOffset = new Date(curDate.getFullYear(), curDate.getMonth(), 1).getDay();
    let amountOfDaysInMonth = new Date(curDate.getFullYear(), curDate.getMonth() + 1, 0).getDate();
    for (let i = 0; i < totalSlots; i++) {
      // set weekdays that don't belong to current month to 0
      if (((i + 1) < dayOffset) || amountOfDaysInMonth === 0) {
        arr.push(0);
      } else {
        arr.push(i - dayOffset + 2);
        amountOfDaysInMonth--;
      }
    }
    setMonthSlots(arr);
  }

  function handleDayBtnPress(assignedDate: Date) {
    setTargetDate(assignedDate);
    setShowModal(true);
  }

  useEffect(() => {
    updateDaysWithTasks();
  }, [db, tasks, curDate]);

  useEffect(() => {
    setIsPopulating(true);
    populateMonthSlots()
    setIsPopulating(false);
  }, [curDate]);

  useFocusEffect(
    useCallback(() => {
      setCurDate(trueToday);
    }, [])
  );

  useEffect(() => {
    fetchAppPrefs();
  }, []);

  return (
    <View style={styles.calendar}>
      {/* nav bar with prev/next month button and current month */}
      <View style={styles.nav}>
        <Pressable
          onPress={getPrevMonth}
          disabled={curDate.getFullYear() > trueToday.getFullYear() ? false : !((curDate.getMonth() + 1) >= trueToday.getMonth())}
          style={styles.navBtn}
        >
          <Text style={[styles.navText, { fontSize: 17 * fontSize }, (curDate.getFullYear() < trueToday.getFullYear() ||
            (curDate.getFullYear() === trueToday.getFullYear() &&
              curDate.getMonth() < trueToday.getMonth())) && styles.disabledArrow]}>&lt;</Text>
        </Pressable>
        <Text style={[styles.navText, { fontSize: 17 * fontSize }]}>{Intl.DateTimeFormat("en-US", { month: "long" }).format(curDate)} {curDate.getFullYear()}</Text>
        <Pressable
          onPress={getNextMonth}
          style={styles.navBtn}
        >
          <Text style={[styles.navText, { fontSize: 17 * fontSize }]}>&gt;</Text>
        </Pressable>
      </View>

      {/* list of weekdays */}
      <View style={styles.weekdays}>
        {weekdays.map(d => <Text key={d}>{d}</Text>)}
      </View>

      {/* days */}
      <View style={styles.slotsWrapper}>
        {(isLoading || isPopulating)
          ? monthSlots.map((s, i) => <View style={styles.daySlot} key={`empty-${i}`}><View style={styles.skeletonSlot}></View></View>)
          : monthSlots.map((s, i) => {
            if (s === 0) {
              return (
                <View key={i} style={styles.daySlot}>
                  <View style={styles.emptySlot}></View>
                </View>
              );
            }
            const dateKey = `${s}-${curDate.getMonth()}-${curDate.getFullYear()}`;
            const day = daysWithTasks?.has(dateKey);
            return (
              <View key={`${s}-${curDate.getMonth()}`} style={styles.daySlot}>
                <Pressable
                  style={[styles.slotBtn, day && styles.hasTasks]}
                  onPress={() => handleDayBtnPress(new Date(curDate.getFullYear(), curDate.getMonth(), s))}
                >
                  <Text
                    style={trueToday.getDate() === s
                      && trueToday.getFullYear() === curDate.getFullYear()
                      && trueToday.getMonth() === curDate.getMonth() && styles.today}
                  >
                    {s}
                  </Text>
                </Pressable>
              </View>
            )
          }
          )}

        <Modal
          animationType='slide'
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
          backdropColor={MAIN_BG}
        >
          <Pressable onPress={() => setShowModal(false)}>
            <Entypo name="cross" size={30} color="#000000" />
          </Pressable>
          <TaskList targetDate={targetDate} />
        </Modal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  calendar: {
    width: '80%',
    padding: 2,
  },
  nav: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#DCDCDC',
  },
  weekdays: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 3,
  },
  slotsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 5
  },
  daySlot: {
    width: '11%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySlot: {
    backgroundColor: '#DCDCDC',
    width: dayBtnSize,
    height: dayBtnSize,
    borderRadius: '50%',
    borderColor: 'gray',
    borderWidth: 1,
  },
  skeletonSlot: {
    backgroundColor: 'gray',
    width: dayBtnSize,
    height: dayBtnSize,
    borderRadius: '50%',
    borderColor: 'gray',
    borderWidth: 1,
  },
  navText: {
    fontWeight: 'bold',
  },
  slotBtn: {
    width: dayBtnSize,
    height: dayBtnSize,
    borderRadius: '50%',
    borderColor: 'gray',
    borderWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  today: {
    fontWeight: 'bold',
  },
  hasTasks: {
    backgroundColor: 'hsla(137, 78%, 81%, 1.00)',
  },
  disabledArrow: {
    color: 'hsla(0, 0%, 63%, 1.00)'
  },
  navBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: 'black'
  }
});
