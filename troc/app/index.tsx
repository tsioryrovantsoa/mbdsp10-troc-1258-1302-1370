import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  
  const [redirect, setRedirect] = useState('/auth/loginPage');

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setRedirect('/(tabs)');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du token', error);
      }
    };

    checkToken();

  }, []);

  return <Redirect href={redirect} />
  
}