import { allThemes, DAY_BTN_SIZE } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import { useTasks } from '@/hooks/useTasks';
import Entypo from '@expo/vector-icons/Entypo';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import CalendarSkeleton from './CalendarSkeleton';
import TaskList from './TaskList';
import Weekdays from './Weekdays';

const totalSlots = 35;
const trueToday = new Date();

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.substring(1);
}

export default function CustomDatePicker() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [curDate, setCurDate] = useState<Date>(new Date());
  const [monthSlots, setMonthSlots] = useState<number[]>([]);
  const [daysWithTasks, setDaysWithTasks] = useState<Set<string>>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [targetDate, setTargetDate] = useState<Date>(trueToday);
  const [isPopulating, setIsPopulating] = useState<boolean>(false);
  const { tasks } = useTasks();
  const { fontSize, curTheme, language, fetchAppPrefs } = useGeneral();
  const db = useSQLiteContext();

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

  function handleDayBtnPress(assignedDate: Date) {
    setTargetDate(assignedDate);
    setShowModal(true);
  }

  useEffect(() => {
    function updateDaysWithTasks() {
      setIsLoading(true);
      const filteredTasks: Set<string> = new Set();
      tasks.forEach(t => {
        const d = new Date(t.assignedDate);
        if (d.getMonth() === curDate.getMonth() && d.getFullYear() === curDate.getFullYear()) {
          filteredTasks.add(`${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`);
        }
      });
      setDaysWithTasks(filteredTasks);
      setIsLoading(false);
    }

    updateDaysWithTasks();
  }, [db, tasks, curDate]);

  useEffect(() => {

    function populateMonthSlots() {
      setIsPopulating(true);
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
      setIsPopulating(false);
    }

    populateMonthSlots();
  }, [curDate]);

  useFocusEffect(
    useCallback(() => {
      setCurDate(trueToday);
    }, [])
  );

  useEffect(() => {
    fetchAppPrefs();
  }, [fetchAppPrefs]);

  return (
    <View style={styles.calendar}>
      {/* nav bar with prev/next month button and current month */}
      <View style={styles.nav}>
        <Pressable
          onPress={getPrevMonth}
          disabled={curDate.getFullYear() > trueToday.getFullYear() ? false : !((curDate.getMonth() + 1) >= trueToday.getMonth())}
          style={styles.navBtn}
        >
          <Text style={[styles.navText, { fontSize: 19 * fontSize }, (curDate.getFullYear() < trueToday.getFullYear() ||
            (curDate.getFullYear() === trueToday.getFullYear() &&
              curDate.getMonth() < trueToday.getMonth())) && styles.disabledArrow]}>&lt;</Text>
        </Pressable>
        <Text style={[styles.navText, { fontSize: 17 * fontSize }]}>
          {capitalize(Intl.DateTimeFormat(language, { month: "long" }).format(curDate))} {curDate.getFullYear()}
        </Text>
        <Pressable
          onPress={getNextMonth}
          style={styles.navBtn}
        >
          <Text style={[styles.navText, { fontSize: 19 * fontSize }]}>&gt;</Text>
        </Pressable>
      </View>

      {/* list of weekdays */}
      <Weekdays />

      {/* days */}
      {(isLoading || isPopulating)
        ? <CalendarSkeleton totalSlots={totalSlots} />
        : (
          <FlatList
            data={monthSlots}
            renderItem={({ item, index }) => {
              if (item === 0) {
                return (
                  <View key={index} style={styles.daySlot}>
                    <View style={styles.emptySlot}></View>
                  </View>
                );
              }
              const dateKey = `${item}-${curDate.getMonth()}-${curDate.getFullYear()}`;
              const day = daysWithTasks?.has(dateKey);
              return (
                <View style={styles.daySlot}>
                  <Pressable
                    style={[styles.slotBtn, { backgroundColor: day ? allThemes[curTheme].dayHighlightBg : allThemes[curTheme].dayBg }]}
                    onPress={() => handleDayBtnPress(new Date(curDate.getFullYear(), curDate.getMonth(), item))}
                  >
                    <Text
                      style={[styles.slotBtnText, { color: allThemes[curTheme].textColor }, trueToday.getDate() === item
                        && trueToday.getFullYear() === curDate.getFullYear()
                        && trueToday.getMonth() === curDate.getMonth() && styles.today]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                </View>
              )
            }}
            keyExtractor={item => `${item}-${curDate.getMonth()}`}
            numColumns={7}
            columnWrapperStyle={{ justifyContent: 'space-between', gap: 5 }}
            contentContainerStyle={styles.slotsWrapper}
            getItemLayout={(_, index) => {
              const row = Math.floor(index / 7);
              return { length: DAY_BTN_SIZE, offset: row * index, index }
            }}
          />
        )}

      <Modal
        animationType='slide'
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        backdropColor={allThemes[curTheme].mainBg}
      >
        <Pressable style={{ alignSelf: 'flex-end', marginRight: 20, marginTop: 15 }} onPress={() => setShowModal(false)}>
          <Entypo name="cross" size={30} color={allThemes[curTheme].textColor} />
        </Pressable>
        <TaskList targetDate={targetDate} />
      </Modal>
    </View >
  )
}

const styles = StyleSheet.create({
  calendar: {
    width: '85%',
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
  slotsWrapper: {
    gap: 5
  },
  daySlot: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySlot: {
    backgroundColor: '#DCDCDC',
    width: DAY_BTN_SIZE,
    height: DAY_BTN_SIZE,
    borderRadius: '50%',
    borderColor: 'gray',
    borderWidth: 1,
  },
  navText: {
    fontWeight: 'bold',
  },
  slotBtn: {
    width: DAY_BTN_SIZE,
    height: DAY_BTN_SIZE,
    borderRadius: '50%',
    borderColor: 'gray',
    borderWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotBtnText: {
    fontSize: 16,
  },
  today: {
    fontWeight: 'bold',
  },
  disabledArrow: {
    color: 'hsla(0, 0%, 63%, 1.00)'
  },
  navBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  }
});
