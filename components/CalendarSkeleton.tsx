import { DAY_BTN_SIZE } from '@/globals';
import React, { memo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

const CalendarSkeleton = memo(function CalendarSkeleton({ totalSlots }: { totalSlots: number}) {
  const dataForSkeletons = Array.from({ length: totalSlots });

  return (
    <FlatList
      data={dataForSkeletons}
      renderItem={() => <View><View style={styles.skeletonSlot}></View></View>}
      keyExtractor={(_, index) => `empty-${index}`}
      numColumns={7}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      contentContainerStyle={styles.slotsWrapper}
      getItemLayout={(_, index) => {
        const row = Math.floor(index / 7);
        return { length: DAY_BTN_SIZE, offset: row * index, index }
      }}
    />
  )
}
)

const styles = StyleSheet.create({
  slotsWrapper: {
    gap: 5
  },
  skeletonSlot: {
    backgroundColor: 'gray',
    width: DAY_BTN_SIZE,
    height: DAY_BTN_SIZE,
    borderRadius: '50%',
    borderColor: 'gray',
    borderWidth: 1,
  },
});

export default CalendarSkeleton;
