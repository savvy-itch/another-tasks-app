import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

export default function TaskSkeleton() {
  const translateX = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: 300,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      })
    ).start();
  }, [translateX]);

  return <Animated.View style={[styles.skeleton, { transform: [{ translateX }] }]} />
}

const styles = StyleSheet.create({
  skeleton: {
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'gray',
    width: '100%',
    height: 47,
    paddingHorizontal: 2,
    paddingVertical: 8,
  }
});
