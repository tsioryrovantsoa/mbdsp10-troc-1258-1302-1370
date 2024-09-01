import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://mbdsp10-troc-1258-1302-1370-spring.onrender.com';

export const authService = {
  async login(username: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Identifiants incorrects');
    }

    const data = await response.json();
    await AsyncStorage.setItem('token', data.accessToken);
    return data;
  },

  async logout() {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      await AsyncStorage.removeItem('token');
    }
  },

  async isTokenValid(): Promise<boolean> {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return false;
    }

    // try {
    //   const response = await fetch(`${API_URL}/validate`, {
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //     },
    //   });
    //   return response.ok;
    // } catch (error) {
    //   return false;
    // }

    return true;
  },
};