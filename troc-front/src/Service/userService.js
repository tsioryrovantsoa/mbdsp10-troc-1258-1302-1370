import axios from 'axios';
import { API_URL } from '../Constante/constante';

const API_USER_URL = `${API_URL}api/users`;

const UserService = {

    register(userData) {
      return axios.post(`${API_USER_URL}/register`, userData);
    },

    login(userData) {
      return axios.post(`${API_URL}api/auth/login`, userData);
    },
    
};
  
export default UserService;