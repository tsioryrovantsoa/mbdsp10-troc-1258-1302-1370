import React from 'react';
import { View, Text, Alert } from 'react-native';
import LoginForm from '../components/LoginForm';
import { login } from '../services/authService';
import { useRouter } from 'expo-router';
import { storeToken } from '@/storage';

const LoginScreen = () => {
  const router = useRouter();

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await login(username, password);
      if (response.success) {
        await storeToken(response.data.accessToken);
        router.push('/ItemsListScreen'); // Redirection vers la liste des items
      } else {
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (error) {
      // console.log("error login >>>>>> " , error);
      Alert.alert('Error', 'Something went wrong');
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center'}}>
      <LoginForm onSubmit={handleLogin} />
    </View>
  );
};

export default LoginScreen;
