import axios from 'axios';
import { API_URL } from '../Constante/constante';
import { jwtDecode } from 'jwt-decode';

const API_USER_URL = `${API_URL}api/users`;

const UserService = {

    register(userData) {
      return axios.post(`${API_USER_URL}/register`, userData);
    },

    login(userData) {
      return axios.post(`${API_URL}api/auth/login`, userData);
    },
    
    getUserIdFromToken() {
      const token = localStorage.getItem('token'); 
      if (!token) return null;
      
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.id;
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        return null;
      }
    }
};
  
export default UserService;