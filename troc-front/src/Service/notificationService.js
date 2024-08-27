import axios from 'axios';
import { EXPRESS_API_URL } from '../Constante/constante';

const API_NOTIFICATIONS_URL = `${EXPRESS_API_URL}api/notifications`;

const NotificationService = {
    nbNotification(userId) {
        const token = localStorage.getItem('token');
        return axios.get(`${API_NOTIFICATIONS_URL}/unread-count/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
    }
}

export default NotificationService;
