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
      console.log(username,password);
      const response = await login(username, password);
      console.log(response);
      if (response.success) {
        await storeToken(response.data.accessToken);
        router.push('/items/ItemsListScreen' as never); // Redirection vers la liste des items
      } else {
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (error) {
      // console.log("error login >>>>>> " , error);
      Alert.alert('Error', 'Something went wrong');
    }
  };  return (
    <View style={{ flex: 1, justifyContent: 'center'}}>
      <LoginForm onSubmit={handleLogin} />
    </View>
  );
};

export default LoginScreen;
