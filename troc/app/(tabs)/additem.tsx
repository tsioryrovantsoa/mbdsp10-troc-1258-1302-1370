import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import LoginScreen from '../authentication/screens/LoginScreen';
import AddItemScreen from '../items/AddItemScreen';

export default function HomeScreen() {
  return <AddItemScreen/>;
};
