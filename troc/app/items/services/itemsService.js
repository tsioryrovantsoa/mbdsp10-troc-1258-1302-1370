import axios from 'axios';

export const fetchItems = async () => {
  try {
    const response = await axios.get('http://10.0.1.83:8080/api/items'); // Modifiez l'URL selon votre API
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      // Erreur venant du serveur
      return { success: false, error: error.response.data.message || 'An unknown error occurred' };
    } else if (error.request) {
      // Erreur lors de l'envoi de la requête
      return { success: false, error: 'Network error. Please try again later.' };
    } else {
      // Erreur lors de la configuration de la requête
      return { success: false, error: error.message || 'An unknown error occurred' };
    }
  }
};
