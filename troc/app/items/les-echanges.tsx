import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const LesEchangesScreen = () => {
  const { itemId, title } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Item ID: {itemId}</Text>
      <Text style={styles.title}>Title: {title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default LesEchangesScreen;
