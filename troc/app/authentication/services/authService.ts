import axios from 'axios';

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post('http://192.168.1.235:8080/api/auth/login', {
      username,
      password,
    });
    return { success: true, data: response.data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Erreur venant du serveur
      return { success: false, error: error.response.data.message || 'An unknown error occurred' };
    } else if (axios.isAxiosError(error) && error.request) {
      // Erreur lors de l'envoi de la requête
      return { success: false, error: 'Network error. Please try again later.' };
    } else {
      // Erreur lors de la configuration de la requête
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
  }
};
