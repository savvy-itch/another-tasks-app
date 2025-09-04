import { MAIN_BG } from '@/globals';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types';
import Entypo from '@expo/vector-icons/Entypo';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import TaskList from './TaskList';

const weekdays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const totalSlots = 35;
const trueToday = new Date();
const dayBtnSize = 34;

export default function CustomDatePicker() {
  const [curDate, setCurDate] = useState<Date>(new Date());
  const [monthSlots, setMonthSlots] = useState<number[]>([]);
  const [daysWithTasks, setDaysWithTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [targetDate, setTargetDate] = useState<Date>(trueToday);
  const [isPopulating, setIsPopulating] = useState<boolean>(false);
  const { tasks, isLoading } = useTasks();
  const db = useSQLiteContext();

  function updateDaysWithTasks() {
    // Keys are needed to avoid unnecessary Date objects creation and their method calls
    const curDateKey = `${curDate.getMonth()}-${curDate.getFullYear()}`;
    setDaysWithTasks(tasks.filter(t => {
      const d = new Date(t.assignedDate);
      const taskKey = `${d.getMonth()}-${d.getFullYear()}`;
      return taskKey === curDateKey;
    }));

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

  return (
    <View style={styles.calendar}>
      {/* nav bar with prev/next month button and current month */}
      <View style={styles.nav}>
        <Pressable
          onPress={getPrevMonth}
          disabled={curDate.getFullYear() > trueToday.getFullYear() ? false : !((curDate.getMonth() + 1) >= trueToday.getMonth())}
          style={styles.navBtn}
        >
          <Text style={[styles.navText, (curDate.getFullYear() < trueToday.getFullYear() ||
            (curDate.getFullYear() === trueToday.getFullYear() &&
              curDate.getMonth() < trueToday.getMonth())) && styles.disabledArrow]}>&lt;</Text>
        </Pressable>
        <Text style={styles.navText}>{Intl.DateTimeFormat("en-US", { month: "long" }).format(curDate)} {curDate.getFullYear()}</Text>
        <Pressable
          onPress={getNextMonth}
          style={styles.navBtn}
        >
          <Text style={styles.navText}>&gt;</Text>
        </Pressable>
      </View>

      {/* list of weekdays */}
      <View style={styles.weekdays}>
        {weekdays.map(d => <Text key={d}>{d}</Text>)}
      </View>

      {/* days */}
      <View style={styles.slotsWrapper}>
        {(isLoading || isPopulating)
          ? monthSlots.map(s => <View style={styles.daySlot} key={s}><View style={styles.skeletonSlot}></View></View>)
          : monthSlots.map((s, i) => {
            if (s === 0) {
              return (
                <View key={i} style={styles.daySlot}>
                  <View style={styles.emptySlot}></View>
                </View>
              );
            }
            const dateKey = `${curDate.getMonth()}-${s}-${curDate.getFullYear()}`;
            const day = daysWithTasks.some(t => {
              const d = new Date(t.assignedDate);
              const taskKey = `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`;
              return dateKey === taskKey;
            });
            // console.log({daysWithTasks});
            return (
              <View key={i} style={styles.daySlot}>
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
    backgroundColor: 'red',
    width: dayBtnSize,
    height: dayBtnSize,
    borderRadius: '50%',
    borderColor: 'gray',
    borderWidth: 1,
  },
  navText: {
    fontWeight: 'bold',
    fontSize: 18,
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
    padding: 5,
  }
});
