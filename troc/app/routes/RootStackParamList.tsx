import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ItemsListScreen from '../items/ItemsListScreen';
import LesEchangesScreen from '../items/les-echanges';

export type RootStackParamList = {
  ItemsListScreen: undefined;
  LesEchangesScreen: { itemId: string; title: string }; // Définir les types des paramètres ici
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ItemsListScreen" component={ItemsListScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
