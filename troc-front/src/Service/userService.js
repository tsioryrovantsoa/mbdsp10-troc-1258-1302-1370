import axios from 'axios';
import { API_URL } from '../Constante/constante';

const API_USER_URL = `${API_URL}api/users`;

const UserService = {

    register(userData) {
      return axios.post(`${API_USER_URL}/register`, userData);
    },
    
};
  
export default UserService;